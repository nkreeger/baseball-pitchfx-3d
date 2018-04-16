// tslint:disable-next-line:max-line-length
import * as socketioClient from 'socket.io-client';

// tslint:disable-next-line:max-line-length
// import {Matchup} from './webgl-matchup';

// function test() {
//   const matchup = new Matchup();

//   matchup.load();
//   const data = {pitch: pitches};

//   document.getElementById('restart-button').onclick =
//       () => { matchup.restart(); };
//   document.getElementById('catcher-button').onclick =
//       () => { matchup.displayCatcher(); };
//   document.getElementById('pitcher-button').onclick =
//       () => { matchup.displayPitcher(); };
//   document.getElementById('overhead-button').onclick =
//       () => { matchup.displayBirdsEye(); };

//   matchup.setData(data);
//   matchup.displayCatcher();
//   matchup.tick();
// }

function connect() {
  const socket = socketioClient('http://localhost:8001');
  socket.on('message', (data: string) => { console.log(data); });
}

// test();
connect();