import { styled } from '@mui/material/styles';
import MuiStack from '@mui/system/Stack';

type StackProps = {
  currentheight: string
};

export const Stack = styled(MuiStack)<StackProps>`
  position: absolute;
  top: calc((100vh - ${props => props.currentheight}) / 2);
  left: 10px;
  background-color: red;
  border-radius: 4px;
`;
