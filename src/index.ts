// tslint:disable-next-line:max-line-length
import {SAMPLE_CB, SAMPLE_CH, SAMPLE_FC, SAMPLE_FF, SAMPLE_FS, SAMPLE_FT, SAMPLE_SL} from './test-data';
import {Matchup} from './webgl-matchup';

function test() {
  const matchup = new Matchup();

  matchup.load();
  const pitches = [
    SAMPLE_FT, SAMPLE_FF, SAMPLE_FS, SAMPLE_FC, SAMPLE_SL, SAMPLE_CH, SAMPLE_CB
  ];
  const data = {pitch: pitches};

  document.getElementById('restart-button').onclick =
      () => { matchup.restart(); };
  document.getElementById('catcher-button').onclick =
      () => { matchup.displayCatcher(); };
  document.getElementById('pitcher-button').onclick =
      () => { matchup.displayPitcher(); };
  document.getElementById('overhead-button').onclick =
      () => { matchup.displayBirdsEye(); };

  matchup.setData(data);
  matchup.displayCatcher();
  matchup.tick();
}

test();