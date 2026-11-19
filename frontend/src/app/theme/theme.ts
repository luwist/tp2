import { definePreset } from '@openng/optimus-ui-themes';
import Aura from '@openng/optimus-ui-themes/aura';
import {
  ButtonPreset,
  ConfirmDialogPreset,
  DialogPreset,
  InputTextPreset,
  MenuPreset,
  PaginatorPreset,
  RadioButtonPreset,
  SelectButtonPreset,
  TextareaPreset,
  ToastPreset,
} from './components';
import { PopoverPreset } from './components/popover-present';
import { ToggleSwitchPreset } from './components/togglesswitch-present';

export const CustomPresent = definePreset(Aura, {
  components: {
    inputtext: InputTextPreset,
    button: ButtonPreset,
    textarea: TextareaPreset,
    dialog: DialogPreset,
    selectbutton: SelectButtonPreset,
    menu: MenuPreset,
    confirmdialog: ConfirmDialogPreset,
    popover: PopoverPreset,
    toggleswitch: ToggleSwitchPreset,
    radiobutton: RadioButtonPreset,
    toast: ToastPreset,
    paginator: PaginatorPreset,
  },
});
