import React, { useState } from 'react';

import { useFormik } from 'formik';

import { requester } from '../../apis/requester';

// username: 콤마로 분리
type Form = {
  token: string;
  org: string;
  teamSlug: string;
  username: string;
};

const placeholders: { [key in keyof Form]: string } = {
  token: 'github personal access token',
  org: 'target organization',
  teamSlug: `target team's team_slug`,
  username: ', (콤마) 로 구분된 공백 없는 리스트여야 합니다. 예) woohm402,ars-ki-00,...',
};

const Main: React.FC = () => {
  const [failedList, setFailedList] = useState<string[]>([]);

  const { values, handleSubmit, handleChange } = useFormik<Form>({
    initialValues: { token: '', org: '', teamSlug: '', username: '' },
    onSubmit: async (values) => {
      const usernames = values.username.split(',');

      for (const item of usernames) {
        try {
          await inviteUser(values.org, values.teamSlug, item, values.token);
          console.log(`[succeed] ${item}`);
        } catch (err) {
          console.log(`[failed ] ${item}`);
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
    <form onSubmit={handleSubmit}>
      {['token', 'org', 'teamSlug', 'username'].map((item, i) => (
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
        실패 아이디 목록
        {failedList.map((item, i) => (
          <p key={i}>{item}</p>
        ))}
      </div>
      <button type={'submit'}>초대</button>
    </form>
  );
};

export default Main;
