import _ from 'lodash';
import Color from 'color';
import { interpolateSinebow } from 'd3-scale-chromatic';
import { format } from 'd3-format';

export const gamutColours = _.range(0, 0.876, 0.125)
    .map(n => ({
        colour: Color(interpolateSinebow(n)).lighten(0.4).rgb().string(),
        gradientPct: format('%')(n + 0.05)
    }));

export const RECOMMENDED_HUE_SHIFT: [number, number] = [-0.2, 0.2];
export const RECOMMENDED_SAT_SHIFT: [number, number] = [0, 1];
export const RECOMMENDED_LGT_SHIFT: [number, number] = [0.7, 1];
