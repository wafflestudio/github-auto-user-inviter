import React, { useState } from 'react';

import { useFormik } from 'formik';

import { requester } from '../../apis/requester';

// username: 콤마로 분리
// permission: select로 변경 필요
type Form = {
  token: string;
  owner: string;
  permission: 'triage';
  repository: string;
  username: string;
};

const placeholders: { [key in keyof Form]: string } = {
  token: 'github personal access token',
  owner: 'owner',
  permission: '권한',
  repository: 'repository name',
  username: ', (콤마) 로 구분된 공백 없는 리스트여야 합니다. 예) woohm402,ars-ki-00,...',
};

const Repository: React.FC = () => {
  const [failedList, setFailedList] = useState<string[]>([]);

  const { values, handleSubmit, handleChange } = useFormik<Form>({
    initialValues: { token: '', owner: '', repository: '', username: '', permission: 'triage' },
    onSubmit: async (values) => {
      const usernames = values.username.split(',');

      for (const item of usernames) {
        try {
          await inviteUser(values.owner, values.repository, item, values.permission, values.token);
          console.log(`[succeed] ${item}`);
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

  const failedListWithComma = failedList.length >= 1 && failedList.reduce((acc, cur) => acc + ',' + cur);

  return (
    <form onSubmit={handleSubmit}>
      {['token', 'owner', 'repository', 'permission', 'username'].map((item, i) => (
        <div key={i}>
          <span style={{ width: 200, display: 'inline-block', textAlign: 'center', margin: 10 }}>{item}</span>
          <textarea
            style={{ width: 600 }}
            value={values[item as keyof Form]}
            name={item}
            onChange={handleChange}
            placeholder={placeholders[item as keyof Form]}
          />
        </div>
      ))}
      <br />
      <br />
      <br />
      <div>
        실패 아이디 목록{' '}
        <button type={'button'} onClick={() => setFailedList([])}>
          목록 날리기
        </button>
        {failedList.map((item, i) => (
          <p key={i}>{item}</p>
        ))}
      </div>
      <button type={'submit'}>초대</button>
      <button type={'button'} onClick={() => navigator.clipboard.writeText(failedListWithComma || '')}>
        실패 목록 클립보드로 복사
      </button>
    </form>
  );
};

export default Repository;
