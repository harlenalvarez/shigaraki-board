import { styled } from '@mui/system';

export const ActionListenerContainer = styled('div')`
  width: 100%;
  height: 100%;
`;

export const MainContainer = styled('div')`
  padding: 5px;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  grid-template-areas: 
  ". . login"
  "menu . com"
  ". . settings";
`;
