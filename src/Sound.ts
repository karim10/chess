class Sound {
    private soundElement: HTMLAudioElement;
    constructor(src: string) {
        this.soundElement = document.createElement("audio");
        this.soundElement.src = src;
        this.soundElement.setAttribute("preload", "auto");
        this.soundElement.setAttribute("controls", "none");
        this.soundElement.style.display = "none";
        document.body.appendChild(this.soundElement);
    }

    public play() {
        this.soundElement.play();
    }

    public stop() {
        this.soundElement.pause();
    }
}


export const sound = new Sound('./move.mp3');