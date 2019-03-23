//简单的移动端适配,前提是设置好meta viewport,不用手动计算dpr
const htmlDOM = document.getElementsByTagName('html')[0];
const htmlWidth = document.documentElement.clientWidth || document.body.clientWidth;

htmlDOM.style.fontSize = htmlWidth / 7.5 + 'px';

window.addEventListener('resize',() => {
    const htmlWidth = document.documentElement.clientWidth || document.body.clientWidth;

    htmlDOM.style.fontSize = htmlWidth / 7.5 + 'px';
});



