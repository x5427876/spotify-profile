export const msToMinute = (duration: number) => {
  let minutes = Math.floor(duration / 60000);
  let seconds = ((duration % 60000) / 1000).toFixed(0);
  return minutes + ":" + (+seconds < 10 ? "0" : "") + seconds;
};

export const calcTotalTime = (list) => {
  let total = 0;

  list.forEach((track) => {
    total += track.track.duration_ms;
  });

  return convertMsToHM(total);
};

const convertMsToHM = (milliseconds) => {
  let seconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);

  seconds = seconds % 60;
  minutes = seconds >= 30 ? minutes + 1 : minutes;
  minutes = minutes % 60;
  hours = hours % 24;

  return `${padTo2Digits(hours) > 0 ? padTo2Digits(hours) + " hr " : ""}
  ${padTo2Digits(minutes) > 0 ? padTo2Digits(minutes) + " min" : " 0 min"}`;
};

const padTo2Digits = (num) => {
  return num.toString().padStart(2, "");
};
