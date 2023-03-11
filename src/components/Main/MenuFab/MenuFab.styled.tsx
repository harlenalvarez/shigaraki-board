import { styleColors } from '@/store';
import MuiButtonGroup from '@mui/material/ButtonGroup';
import MuiIconButton from '@mui/material/IconButton';
import styled from '@mui/system/styled';

export const ButtonGroup = styled(MuiButtonGroup)`
  grid-area: menu;
  background-color: white;
  overflow: hidden;
  width: 65px;
`;

export const IconButton = styled(MuiIconButton)`
  border-radius: 0;
  background-color: ${props => props['aria-selected'] ? styleColors.mainColor : 'white'};
`;
