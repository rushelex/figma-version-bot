import { Api } from 'figma-api';
import { FIGMA_TOKEN } from '../config';

export const figma = new Api({ personalAccessToken: FIGMA_TOKEN });
