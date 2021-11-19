import React, { useState } from 'react';

import { Button, Card, CardActions, CardContent, styled, TextField } from '@mui/material';
import { useFormik } from 'formik';

import { requester } from '../../apis/requester';

// username: 콤마로 분리
type Form = {
  'personal access token': string;
  organization: string;
  'team slug': string;
  'target usernames': string;
};

const placeholders: { [key in keyof Form]: string } = {
  'personal access token': 'your github personal access token',
  organization: 'wafflestudio',
  'team slug': `team-1`,
  'target usernames': ', (콤마) 로 구분된 공백 없는 리스트여야 합니다. 예) woohm402,ars-ki-00,...',
};

const IDListWrapper = styled('ul')({
  overflowY: 'auto',
  maxHeight: 'calc(100% - 40px)',
  padding: 8,
  borderRadius: 4,
  border: '1px solid #ddd',
});

const FormCard = styled(Card)({
  position: 'fixed',
  left: '10vw',
  width: '50vw',
  top: 'calc(50% - 300px)',
  bottom: 'calc(50% - 300px)',
  padding: 30,
});

const IDListSucceedCard = styled(Card)({
  position: 'fixed',
  right: '10vw',
  width: '25vw',
  top: 'calc(50% - 300px)',
  bottom: 'calc(50% + 20px)',
  padding: 30,
});

const IDListFailedCard = styled(Card)({
  position: 'fixed',
  right: '10vw',
  width: '25vw',
  top: 'calc(50% + 20px)',
  bottom: 'calc(50% - 300px)',
  padding: 30,
});

const IDItem = styled('li')({ listStyleType: 'none' });

const Input = styled(TextField)(() => ({
  width: '100%',
  marginBottom: 20,
}));

const Team: React.FC = () => {
  const [succeedList, setSucceedList] = useState<string[]>([]);
  const [failedList, setFailedList] = useState<string[]>([]);

  const { values, submitForm, handleChange } = useFormik<Form>({
    initialValues: { 'personal access token': '', organization: '', 'team slug': '', 'target usernames': '' },
    onSubmit: async (values) => {
      const usernames = values['target usernames'].split(',');

      for (const item of usernames) {
        try {
          await inviteUser(values.organization, values['team slug'], item, values['personal access token']);
          setSucceedList((list) => [...list, item]);
        } catch (err) {
          setFailedList((list) => [...list, item]);
        }
      }
    },
  });

  const inviteUser = async (org: string, teamSlug: string, username: string, token: string) => {
    await requester.put(`/orgs/${org}/teams/${teamSlug}/memberships/${username}`, null, {
      headers: {
        Authorization: `token ${token}`,
      },
    });
  };

  return (
    <>
      <FormCard>
        <CardContent>
          {Object.entries(placeholders).map(([key, value], i) => (
            <Input key={i} label={key} value={values[key as keyof Form]} name={key} onChange={handleChange} placeholder={value} />
          ))}
        </CardContent>
        <CardActions>
          <Button type={'submit'} onClick={submitForm}>
            초대
          </Button>
        </CardActions>
      </FormCard>
      <IDListSucceedCard>
        <span>성공 아이디 목록</span>
        <IDListWrapper>
          {succeedList.map((item, i) => (
            <IDItem key={i}>{item}</IDItem>
          ))}
        </IDListWrapper>
      </IDListSucceedCard>
      <IDListFailedCard>
        <span>실패 아이디 목록</span>{' '}
        <Button onClick={() => navigator.clipboard.writeText(failedList.join(','))}>포맷에 맞게 복사</Button>
        <IDListWrapper>
          {failedList.map((item, i) => (
            <IDItem key={i}>{item}</IDItem>
          ))}
        </IDListWrapper>
      </IDListFailedCard>
    </>
  );
};

export default Team;
