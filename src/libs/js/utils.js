String.prototype.takeChars = function (max = 50) {
    return this.length > max ? 
        (this.substring (0, max) + '...') : this;
}