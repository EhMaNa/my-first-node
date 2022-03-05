module.exports = function (req, flash, intro, message) {
    const msg = flash;
    req.flash(intro, msg.intro);
    req.flash(message, msg.message);

}