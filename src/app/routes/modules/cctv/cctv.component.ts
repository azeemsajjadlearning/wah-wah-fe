import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CCTVService } from 'src/app/services/cctv.service';

declare var JSMpeg: any;

@Component({
  selector: 'app-cctv',
  templateUrl: 'cctv.component.html',
  styleUrls: ['cctv.component.scss'],
  standalone: false,
})
export class CCTVComponent implements OnInit, OnDestroy {
  constructor(
    private cctvService: CCTVService,
    private cdr: ChangeDetectorRef
  ) {}

  showStartButton = false;
  showChannels = false;
  isSingleView = false;
  isFullscreen = false;
  singleChannel: string = '';
  channels: string[] = ['102', '202', '302', '402', '502', '602'];
  streamUrls: { [channel: string]: string } = {};
  players: { [channel: string]: any } = {};

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

      // Unlock orientation on exit
      if (!this.isFullscreen && screen.orientation?.unlock) {
        try {
          screen.orientation.unlock();
        } catch {}
      }
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

  viewRecording(channel: string) {
    Object.keys(this.players).forEach((channel) => {
      this.cctvService.stopStream(channel).subscribe();
      this.players[channel].destroy();
    });
    this.players = {};

    this.isSingleView = true;
    this.cdr.detectChanges();

    const datetime = new Date('2025-06-15');

    this.cctvService.viewRecording(channel, datetime).subscribe((res: any) => {
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
}
