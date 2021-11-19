import React from 'react';

import { Card, styled, Typography, Stack, CardActionArea, Link as MuiLink } from '@mui/material';
import Link from 'next/link';

const LinkCard = styled(Card)({
  maxWidth: '600px',
  width: '80%',
  marginTop: '10px',
});

const ActionArea = styled(CardActionArea)({
  paddingTop: '20px',
  paddingBottom: '20px',
  paddingLeft: '30px',
});

const Home: React.FC = () => {
  return (
    <Stack alignItems="center" sx={{ width: '100%', marginTop: '20px' }}>
      <Typography variant="h3" textAlign="center">
        Github Auto User Inviter
      </Typography>
      <MuiLink href="https://github.com/wafflestudio/github-auto-user-inviter" textAlign="center" sx={{ marginBottom: '20px' }}>
        Github
      </MuiLink>
      <Typography variant="body1">console에 로그 찍히는 것 확인하면서 사용하세요!</Typography>
      <LinkCard>
        <Link href="/repository" passHref>
          <ActionArea>
            <Typography variant="h5">/repository</Typography>
            <Typography variant="body1">특정 레포에 collaborator로 유저들 초대</Typography>
          </ActionArea>
        </Link>
      </LinkCard>
      <LinkCard>
        <Link href="/team" passHref>
          <ActionArea>
            <Typography variant="h5">/team</Typography>
            <Typography variant="body1">
              특정 팀에 유저들 초대
              <br />
              organization에 초대 안 되어있을 경우 invitation도 보냄
            </Typography>
          </ActionArea>
        </Link>
      </LinkCard>
      <LinkCard>
        <Link href="/organization" passHref>
          <ActionArea>
            <Typography variant="h5">/organization</Typography>
            <Typography variant="body1">
              특정 organization에 유저들을 초대
              <br />
              동시에 team 초대도 가능
            </Typography>
          </ActionArea>
        </Link>
      </LinkCard>
    </Stack>
  );
};

export default Home;
