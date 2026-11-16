import { definePreset } from '@openng/optimus-ui-themes';
import Aura from '@openng/optimus-ui-themes/aura';
import {
  ButtonPreset,
  ConfirmDialogPreset,
  DialogPresent,
  InputTextPreset,
  MenuPreset,
  SelectButtonPreset,
  TextareaPreset,
} from './components';
import { PopoverPreset } from './components/popover-present';

export const CustomPresent = definePreset(Aura, {
  components: {
    inputtext: InputTextPreset,
    button: ButtonPreset,
    textarea: TextareaPreset,
    dialog: DialogPresent,
    selectbutton: SelectButtonPreset,
    menu: MenuPreset,
    confirmdialog: ConfirmDialogPreset,
    popover: PopoverPreset,
  },
});
