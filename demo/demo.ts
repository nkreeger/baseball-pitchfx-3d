import * as pfx3d from '../src/index';
import { Pitch } from 'baseball-pitchfx-types';

const matchup = new pfx3d.Matchup();

matchup.initialize('webgl-canvas', 'baseball-image');
const pitches = [
    // tslint:disable-next-line:max-line-length
    { "des": "Called Strike", "id": 3, "type": "S", "code": "C", "tfs_zulu": "2018-06-19T17:05:45Z", "x": 145.26, "y": 194.48, "start_speed": 92.4, "end_speed": 84.8, "sz_top": 3.548343822624041, "sz_bot": 1.609173571993658, "pfx_x": -2.442262273974516, "pfx_z": 7.764283812346776, "px": -0.741505891231239, "pz": 1.64139768185282, "x0": -2.63882885225069, "y0": 50, "z0": 5.4892058201326, "vx0": 5.87417563225145, "vy0": -134.263367616907, "vz0": -6.81677604734278, "ax": -4.4649919045496, "ay": 28.6466265518902, "az": -17.9792322436286, "break_y": 23.8, "break_angle": 9.6, "break_length": 4.4, "pitch_type": "FF", "pitch_code": 1, "type_confidence": 0.895, "zone": 13, "nasty": 71, "spin_dir": 197.46, "spin_rate": 1607.906, "left_handed_pitcher": 0, "left_handed_batter": 1 },
    // tslint:disable-next-line:max-line-length
    { "des": "In play, run(s)", "id": 4, "type": "X", "code": "E", "tfs_zulu": "2018-06-19T17:06:00Z", "x": 106.89, "y": 197.31, "start_speed": 92.6, "end_speed": 85.2, "sz_top": 3.44883328016072, "sz_bot": 1.622101478635301, "pfx_x": -0.42846462382301753, "pfx_z": 8.336463879120528, "px": 0.264953825596207, "pz": 1.53680000511282, "x0": -2.49966034152969, "y0": 50, "z0": 5.42293869365706, "vx0": 7.50120019583138, "vy0": -134.575072922822, "vz0": -7.16909575658453, "ax": -0.787785421040174, "ay": 28.4958294804068, "az": -16.8464244263415, "break_y": 23.8, "break_angle": -2.2, "break_length": 4, "pitch_type": "FF", "pitch_code": 1, "type_confidence": 0.806, "zone": 14, "nasty": 41, "spin_dir": 182.94, "spin_rate": 1654.565, "left_handed_pitcher": 0, "left_handed_batter": 1 },
    // tslint:disable-next-line:max-line-length
    { "des": "Called Strike", "id": 9, "type": "S", "code": "C", "tfs_zulu": "2018-06-19T17:06:50Z", "x": 91, "y": 197.3, "start_speed": 93.1, "end_speed": 85.5, "sz_top": 3.081210583325614, "sz_bot": 1.4486735518210025, "pfx_x": -2.231965210894476, "pfx_z": 10.114281658339753, "px": 0.681361584336033, "pz": 1.53839025189282, "x0": -2.3248665907802, "y0": 50.0000000000001, "z0": 5.42205083306661, "vx0": 8.79741729991581, "vy0": -135.095258704278, "vz0": -7.84515135138795, "ax": -4.13153544845856, "ay": 28.9833191139038, "az": -13.4517526159941, "break_y": 23.8, "break_angle": 8.7, "break_length": 3.3, "pitch_type": "FF", "pitch_code": 1, "type_confidence": 0.918, "zone": 9, "nasty": 68, "spin_dir": 192.443, "spin_rate": 2058.947, "left_handed_pitcher": 0, "left_handed_batter": 1 },
    // tslint:disable-next-line:max-line-length
    { "des": "Ball", "id": 10, "type": "B", "code": "B", "tfs_zulu": "2018-06-19T17:07:08Z", "x": 190.45, "y": 151.89, "start_speed": 91.1, "end_speed": 83.2, "sz_top": 2.8969756024085527, "sz_bot": 1.2434021624645268, "pfx_x": -8.56013618245314, "pfx_z": 7.16269272929442, "px": -1.92702163215883, "pz": 3.21767414053463, "x0": -2.45866144716301, "y0": 50, "z0": 5.57905456174843, "vx0": 4.31082946638154, "vy0": -132.662831481186, "vz0": -2.49694218725233, "ax": -15.2961474404476, "ay": 27.6677645906759, "az": -19.3749993681135, "break_y": 23.8, "break_angle": 35.9, "break_length": 5.6, "pitch_type": "FT", "pitch_code": 0, "type_confidence": 0.903, "zone": 11, "nasty": 38, "spin_dir": 230.078, "spin_rate": 2181.112, "left_handed_pitcher": 0, "left_handed_batter": 1 },
] as Pitch[];
matchup.setPitches(pitches);

// // tslint:disable-next-line:no-debugger
// debugger;
matchup.restart();