import * as pfx3d from '../src/index';
import { Pitch } from 'baseball-pitchfx-types';

const matchup = new pfx3d.Matchup();

matchup.initialize('webgl-canvas', 'baseball-image');
const pitches = [
  {
    "sz_top": 3.548343822624041,
    "sz_bot": 1.609173571993658,
    "x0": -2.63882885225069,
    "y0": 50,
    "z0": 5.4892058201326,
    "vx0": 5.87417563225145,
    "vy0": -134.263367616907,
    "vz0": -6.81677604734278,
    "ax": -4.4649919045496,
    "ay": 28.6466265518902,
    "az": -17.9792322436286
  },
  {
    "sz_top": 3.44883328016072,
    "sz_bot": 1.622101478635301,
    "x0": -2.49966034152969,
    "y0": 50,
    "z0": 5.42293869365706,
    "vx0": 7.50120019583138,
    "vy0": -134.575072922822,
    "vz0": -7.16909575658453,
    "ax": -0.787785421040174,
    "ay": 28.4958294804068,
    "az": -16.8464244263415
  },
  {
    "sz_top": 3.081210583325614,
    "sz_bot": 1.4486735518210025,
    "x0": -2.3248665907802,
    "y0": 50.0000000000001,
    "z0": 5.42205083306661,
    "vx0": 8.79741729991581,
    "vy0": -135.095258704278,
    "vz0": -7.84515135138795,
    "ax": -4.13153544845856,
    "ay": 28.9833191139038,
    "az": -13.4517526159941
  },
  {
    "sz_top": 2.8969756024085527,
    "sz_bot": 1.2434021624645268,
    "x0": -2.45866144716301,
    "y0": 50,
    "z0": 5.57905456174843,
    "vx0": 4.31082946638154,
    "vy0": -132.662831481186,
    "vz0": -2.49694218725233,
    "ax": -15.2961474404476,
    "ay": 27.6677645906759,
    "az": -19.3749993681135
  },
] as Pitch[];
matchup.setPitches(pitches);

// TODO - cleanup this API:
matchup.restart();

// TODO - use this?
document.getElementById('restart-button').onclick = () => {
  matchup.restart();
};
document.getElementById('pitcher-button').onclick = () => {
  matchup.displayPitcher();
};
document.getElementById('catcher-button').onclick = () => {
  matchup.displayCatcher();
};
document.getElementById('overhead-button').onclick = () => {
  matchup.displayBirdsEye();
};