import { definePreset } from '@openng/optimus-ui-themes';
import Aura from '@openng/optimus-ui-themes/aura';
import { ButtonPreset, InputTextPreset, TextareaPreset } from './components';

export const CustomPresent = definePreset(Aura, {
  components: {
    inputtext: InputTextPreset,
    button: ButtonPreset,
    textarea: TextareaPreset,
  },
});
