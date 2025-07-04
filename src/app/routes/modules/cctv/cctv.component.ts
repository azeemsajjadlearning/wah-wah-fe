import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from 'src/app/environments/environment';
import { CCTVService } from 'src/app/services/cctv.service';

declare var JSMpeg: any;

interface Recordings {
  filename: string;
  size: string;
  downloadUrl: string;
  created_on: Date;
}

@Component({
  selector: 'app-cctv',
  templateUrl: 'cctv.component.html',
  styleUrls: ['cctv.component.scss'],
  standalone: false,
})
export class CCTVComponent implements OnInit, OnDestroy {
  constructor(
    private cctvService: CCTVService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) {}

  showStartButton = false;
  showChannels = false;
  isSingleView = false;
  isFullscreen = false;
  isPlayBack = false;
  singleChannel: string = '';
  channels: string[] = ['102', '502', '602', '302', '202', '402'];
  streamUrls: { [channel: string]: string } = {};
  players: { [channel: string]: any } = {};
  now = new Date();
  selectedDate: FormControl = new FormControl(this.now);
  recordingList: Recordings[] = [];
  dataSource = new MatTableDataSource<Recordings>();

  displayedColumns: string[] = ['filename', 'size', 'created_on', 'action'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    if (typeof JSMpeg === 'undefined') {
      const script = document.createElement('script');
      script.src =
        'https://rawcdn.githack.com/phoboslab/jsmpeg/master/jsmpeg.min.js';
      script.onload = () => {
        console.log('JSMpeg loaded');
        this.showStartButton = true;
      };
      document.body.appendChild(script);
    } else {
      this.showStartButton = true;
    }

    document.addEventListener('fullscreenchange', () => {
      this.isFullscreen = !!document.fullscreenElement;

      if (!this.isFullscreen && screen.orientation?.unlock) {
        try {
          screen.orientation.unlock();
        } catch {}
      }
    });

    this.selectedDate.valueChanges.subscribe((date: Date) => {
      this.viewRecording(
        this.getBaseChannel(this.singleChannel || this.channels[0]),
        date || this.now
      );
    });

    this.cctvService.getAllRecordings().subscribe((resp) => {
      this.recordingList = resp.recordings;
      this.dataSource.data = this.recordingList;
    });
  }

  ngOnDestroy(): void {
    this.stopAllStreams();
  }

  startStream() {
    this.channels.forEach((channel) => {
      this.cctvService.startStream(channel).subscribe((res: any) => {
        this.streamUrls[channel] = res.wsUrl;
        const canvas = document.getElementById(
          `video-canvas-${channel}`
        ) as HTMLCanvasElement;
        if (canvas && typeof JSMpeg !== 'undefined') {
          this.players[channel] = new JSMpeg.Player(res.wsUrl, { canvas });
        }
      });
    });
    this.showChannels = true;
  }

  stopAllStreams() {
    Object.keys(this.players).forEach((channel) => {
      this.cctvService.stopStream(channel).subscribe();
      this.players[channel].destroy();
    });
    this.players = {};
    this.showChannels = false;
    this.isSingleView = false;
  }

  showSingleCamera(originalChannel: string) {
    this.stopAllStreams();

    const altChannel = (+originalChannel - 1).toString();
    this.singleChannel = altChannel;
    this.isSingleView = true;
    this.cdr.detectChanges();

    setTimeout(() => {
      this.cctvService.startStream(altChannel).subscribe((res: any) => {
        const canvas = document.getElementById(
          `video-canvas-single`
        ) as HTMLCanvasElement;

        if (canvas && typeof JSMpeg !== 'undefined') {
          this.players[altChannel] = new JSMpeg.Player(res.wsUrl, { canvas });
        } else {
          console.error('Single view canvas or JSMpeg missing');
        }
      });
    }, 100);
  }

  exitSingleView() {
    if (this.singleChannel) {
      this.cctvService.stopStream(this.singleChannel).subscribe();
      this.players[this.singleChannel]?.destroy();
      delete this.players[this.singleChannel];
    }

    this.isSingleView = false;
    this.isPlayBack = false;
    this.singleChannel = '';
    this.startStream();
  }

  getBaseChannel(channel: string | number): string {
    const str = channel.toString();
    if (str.length === 3 && str.endsWith('2')) {
      return (parseInt(str) - 1).toString();
    }
    return str;
  }

  stopStream() {
    this.channels.forEach((channel) => {
      this.cctvService.stopStream(channel).subscribe(() => {
        if (this.players[channel]) {
          this.players[channel].destroy();
          delete this.players[channel];
        }
      });
    });
    this.showChannels = false;
  }

  viewRecording(
    channel: string,
    date: any = this.now,
    withtime: boolean = false
  ) {
    Object.keys(this.players).forEach((channel) => {
      this.cctvService.stopStream(channel).subscribe();
      this.players[channel].destroy();
    });
    this.players = {};

    this.isSingleView = true;
    this.isPlayBack = true;
    this.singleChannel = channel;
    this.cdr.detectChanges();
    let today;

    if (withtime) {
      today = new Date(date);
    } else {
      today = new Date(
        `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
          2,
          '0'
        )}-${String(date.getDate()).padStart(2, '0')}`
      );
    }

    this.cctvService.viewRecording(channel, today).subscribe((res: any) => {
      const canvas = document.getElementById(
        `video-canvas-single`
      ) as HTMLCanvasElement;

      if (canvas && typeof JSMpeg !== 'undefined') {
        this.players[channel] = new JSMpeg.Player(res.wsUrl, { canvas });
      } else {
        console.error('Single view canvas or JSMpeg missing');
      }
    });
  }

  openRecordingForm() {
    const recordingDialogRef = this.dialog.open(RecordingDialog, {
      width: '400px',
    });

    recordingDialogRef.afterClosed().subscribe((val) => {
      this.cctvService
        .recordSegment(
          this.getBaseChannel(this.singleChannel),
          val.start,
          val.duration
        )
        .subscribe((resp) => {
          console.log(resp);
        });
    });
  }

  downloadVideo(recording: Recordings) {
    window.open(
      new URL(environment.api_prefix).origin + recording.downloadUrl,
      '_blank'
    );
  }

  goFullScreen() {
    const canvas = document.getElementById(
      'video-canvas-single'
    ) as HTMLCanvasElement;
    if (!canvas) return;

    const container = canvas.parentElement;
    if (!container) return;

    if (!this.isFullscreen) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if ((container as any).webkitRequestFullscreen) {
        (container as any).webkitRequestFullscreen();
      } else if ((container as any).msRequestFullscreen) {
        (container as any).msRequestFullscreen();
      }

      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile && screen.orientation && (screen.orientation as any).lock) {
        (screen.orientation as any).lock('landscape').catch(() => {});
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
    }
  }

  playRecording() {
    console.log('play');
  }

  pauseRecording() {
    console.log('pauseRecording');
  }

  formatLabel(value: number): string {
    const hours = Math.floor(value / 3600);
    const minutes = Math.floor((value % 3600) / 60);
    const seconds = value % 60;

    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }

  onSliderChange(event: any) {
    const seconds = event.target.value;
    let today = new Date(
      `${this.selectedDate.value.getFullYear()}-${String(
        this.selectedDate.value.getMonth() + 1
      ).padStart(2, '0')}-${String(this.selectedDate.value.getDate()).padStart(
        2,
        '0'
      )}`
    );

    this.stopAllStreams();

    this.viewRecording(
      this.getBaseChannel(this.singleChannel || this.channels[0]),
      today.getTime() + seconds * 1000,
      true
    );
  }
}

@Component({
  templateUrl: 'recording-dialog.html',
  standalone: false,
})
export class RecordingDialog {
  constructor(
    public dialogRef: MatDialogRef<RecordingDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {}

  form = this.fb.group({
    date: [new Date(), Validators.required],
    time: ['12:00', Validators.required],
    duration: [60, [Validators.required, Validators.min(1)]],
  });

  submit() {
    let input = {
      date: this.form.get('date')?.value,
      time: this.form.get('time')?.value,
    };

    let start = this.combineDateAndTime(input);

    this.dialogRef.close({
      start: start,
      duration: this.form.get('duration')?.value,
    });
  }

  private combineDateAndTime({ date, time }: any): Date {
    const baseDate = new Date(date);
    const [hours, minutes] = time.split(':').map(Number);

    return new Date(
      baseDate.getFullYear(),
      baseDate.getMonth(),
      baseDate.getDate(),
      hours,
      minutes
    );
  }
}
