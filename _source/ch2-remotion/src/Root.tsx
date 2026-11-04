// @ts-nocheck
import React from 'react';
import {Composition} from 'remotion';
import * as S from './scenes';
export const LIST = [
  ['reversible', S.Reversible, 8], ['ammonium-chloride', S.Ammonium, 10.5], ['copper-sulfate', S.Copper, 12], ['cobalt-chloride', S.Cobalt, 12],
  ['water-tests', S.WaterTests, 6.5], ['cobalt-practical', S.CobaltPractical, 12.5], ['open-closed', S.OpenClosed, 8.5], ['equilibrium-graphs', S.Graphs, 9.5],
  ['dynamic', S.Dynamic, 11], ['escalator', S.Escalator, 8.5], ['pressure', S.Pressure, 12.5], ['concentration', S.Concentration, 16],
  ['catalyst', S.Catalyst, 9.5], ['haber', S.Haber, 15], ['contact', S.Contact, 12.5],
];
export const Root = () => <>{LIST.map(([id, C, d]) => <Composition key={id} id={id} component={C} durationInFrames={Math.round(d * 30)} fps={30} width={1280} height={720} />)}</>;
