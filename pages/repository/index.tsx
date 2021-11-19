import React, { useState } from 'react';

import { Button, Card, CardActions, CardContent, styled, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';

import { requester } from '../../apis/requester';

// username: 콤마로 분리
// permission: select로 변경 필요
type Form = {
  'personal access token': string;
  owner: string;
  permission: 'triage';
  repository: string;
  'target usernames': string;
};

const placeholders: { [key in keyof Form]: string } = {
  'personal access token': 'github personal access token',
  owner: 'owner',
  permission: '권한',
  repository: 'repository name',
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
  left: '5vw',
  width: '50vw',
  top: 'calc(50% - 300px)',
  bottom: 'calc(50% - 300px)',
  padding: 30,
});

const IDListSucceedCard = styled(Card)({
  position: 'fixed',
  right: '5vw',
  width: '35vw',
  top: 'calc(50% - 300px)',
  bottom: 'calc(50% + 20px)',
  padding: 30,
});

const IDListFailedCard = styled(Card)({
  position: 'fixed',
  right: '5vw',
  width: '35vw',
  top: 'calc(50% + 20px)',
  bottom: 'calc(50% - 300px)',
  padding: 30,
});

const IDItem = styled('li')({ listStyleType: 'none' });

const Input = styled(TextField)(() => ({
  width: '100%',
  marginBottom: 20,
}));

const Repository: React.FC = () => {
  const [succeedList, setSucceedList] = useState<string[]>([]);
  const [failedList, setFailedList] = useState<string[]>([]);

  const { values, submitForm, handleChange, setFieldValue } = useFormik<Form>({
    initialValues: {
      'personal access token': '',
      owner: '',
      permission: 'triage',
      repository: '',
      'target usernames': '',
    },
    onSubmit: async (values) => {
      const usernames = values['target usernames'].split(',');

      for (const item of usernames) {
        try {
          await inviteUser(values.owner, values.repository, item, values.permission, values['personal access token']);
          console.log(`[succeed] ${item}`);
          setSucceedList((list) => [...list, item]);
        } catch (err) {
          console.log(`[failed ] ${item}`);
          setFailedList((list) => [...list, item]);
        }
      }
    },
  });

  const inviteUser = async (owner: string, repository: string, username: string, permission: string, token: string) => {
    await requester.put(
      `/repos/${owner}/${repository}/collaborators/${username}`,
      { permission },
      {
        headers: {
          Authorization: `token ${token}`,
        },
      }
    );
  };

  return (
    <>
      <Typography variant="h4" sx={{ marginLeft: '5vw', marginTop: '15px' }}>
        /repository
      </Typography>
      <FormCard>
        <CardContent>
          {Object.entries(placeholders).map(([key, placeholder], i) => (
            <Input
              type={key === 'personal access token' ? 'password' : 'text'}
              autoComplete={'off'}
              key={i}
              label={
                key === 'target usernames' ? `${key} (${values[key as keyof Form].split(',').filter((t) => t).length}명)` : key
              }
              value={values[key as keyof Form]}
              name={key}
              onChange={(e) => {
                if (key === 'target usernames') {
                  setFieldValue('target usernames', e.target.value.replace(/\s/g, ''));
                } else {
                  handleChange(e);
                }
              }}
              placeholder={placeholder}
            />
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
        <span>실패 아이디 목록</span>
        <Button onClick={() => navigator.clipboard.writeText(failedList.join(','))}>복사</Button>
        <Button
          onClick={() => {
            setFieldValue('target usernames', failedList.join(','));
          }}
        >
          입력
        </Button>
        <Button onClick={() => setFailedList([])}>목록 날리기</Button>
        <IDListWrapper>
          {failedList.map((item, i) => (
            <IDItem key={i}>{item}</IDItem>
          ))}
        </IDListWrapper>
      </IDListFailedCard>
    </>
  );
};

export default Repository;
