/**
 * Created by Ana Zalozna on 18.03.17.
 */

/**
 * Custom video controllers
 */
export default class VideoControl{

    constructor(video_block){
        this._video = video_block.querySelector('video');
        this._play_btn = video_block.querySelector('.fa-play');
        this._stop_btn = video_block.querySelector('.fa-pause');
        this._mute_btn = video_block.querySelector('.fa-volume-up');
        this._unmute_btn = video_block.querySelector('.fa-volume-off');
        this._fullscreen_btn = video_block.querySelector('.fa-arrows-alt');
        this._progress_bar_container = video_block.querySelector('.progress-bar');
        this._progress_bar = video_block.querySelector('.progress-bar .volume');
        this._time = video_block.querySelector('.time');

        this._events = [
            {element: this._video, func: this._videoTimeUpdateCallback, event: 'timeupdate'},
            {element: this._video, func: this._reloadVideo, event: 'ended'},
            {element: this._video, func: this._toggleVideoMode, event: 'click'},
            {element: this._play_btn, func: this._play, event: 'click'},
            {element: this._stop_btn, func: this._pause, event: 'click'},
            {element: this._mute_btn, func: this._mute, event: 'click'},
            {element: this._unmute_btn, func: this._unmute, event: 'click'},
            {element: this._fullscreen_btn, func: this._turnOnFullScreen, event: 'click'},
            {element: this._progress_bar_container, func: this._changeVideoBarPos, event: 'mousedown'}
        ];
    }

    /**
     * Hide html element
     *
     * @param element
     * @private
     */
    static _hide(element){
        element.classList.add('hidden');
    }

    /**
     * Show html element
     *
     * @param element
     * @private
     */
    static _show(element){
        element.classList.remove('hidden');
    }

    /**
     * Implements new controls
     */
    implement(){
        // hide default controls
        this._video.removeAttribute('controls');

        // attach events to controllers
        this._events.forEach(data => {
            data.element.addEventListener(data.event, e => data.func.call(this, e));
        });

        // start time counter
        this._showTime();
    }

    /**
     * Do action for playing video
     *
     * @private
     */
    _play(){
        this._video.play();
        VideoControl._hide(this._play_btn);
        VideoControl._show(this._stop_btn);
    };

    /**
     * Do action for stopping video
     *
     * @private
     */
    _pause(){
        this._video.pause();
        VideoControl._hide(this._stop_btn);
        VideoControl._show(this._play_btn);
    }

    /**
     * Stop/pause vide
     *
     * @private
     */
    _toggleVideoMode(){
        if(this._video.paused){
            this._play();
        }else{
            this._pause();
        }
    }

    /**
     * Do action for mute video
     *
     * @private
     */
    _mute(){
        this._video.muted = true;
        VideoControl._hide(this._mute_btn);
        VideoControl._show(this._unmute_btn);
    }

    /**
     * Do action for unmute video
     *
     * @private
     */
    _unmute(){
        this._video.muted = false;
        VideoControl._hide(this._unmute_btn);
        VideoControl._show(this._mute_btn);
    }

    /**
     * Turn on full screen mode
     *
     * @private
     */
    _turnOnFullScreen(){
        if(this._video.requestFullscreen){
            this._video.requestFullscreen();
        }else if(this._video.webkitEnterFullscreen){
            this._video.webkitEnterFullscreen();
        }else if(this._video.mozRequestFullScreen){
            this._video.mozRequestFullScreen();
        }else{
            alert('Your browsers doesn\'t support fullscreen');
        }
    }

    /**
     * Update progress bar when video is playing
     *
     * @private
     */
    _videoTimeUpdateCallback(){
        let progress = (this._video.currentTime/this._video.duration) * 100;
        this._progress_bar.style.width = progress + "%";
    }

    /**
     * Update bar
     *
     * @param x
     * @param bar
     * @param callback
     * @private
     */
    _updateBar(x, bar, callback){
        let position	= x - bar.getBoundingClientRect().left,
            percentage	= 100 * position / bar.offsetWidth;
        if(percentage > 100){
            percentage = 100;
        }else if(percentage < 0){
            percentage = 0;
        }
        callback.call(this, percentage / 100);
    }

    /**
     * Change video progress bar by click
     *
     * @param event
     * @private
     */
    _changeVideoBarPos(event){
        this._updateBar(event.pageX, this._progress_bar_container, videoVal => {
            this._video.currentTime = this._video.duration * videoVal;
        });
    }

    /**
     * Reload video to beginning
     *
     * @private
     */
    _reloadVideo(){
        this._video.load();
        VideoControl._hide(this._stop_btn);
        VideoControl._show(this._play_btn);
        this._progress_bar.style.width = 0;
    }

    /**
     * Show time counter
     *
     * @private
     */
    _showTime(){
        setInterval(() => {
            let seconds = this._video.currentTime,
                minutes;
            minutes = Math.floor(seconds / 60);
            minutes = (minutes >= 10) ? minutes : "0" + minutes;
            seconds = Math.floor(seconds % 60);
            seconds = (seconds >= 10) ? seconds : "0" + seconds;
            this._time.innerHTML =  minutes + ":" + seconds;

        }, 1000)
    }
}