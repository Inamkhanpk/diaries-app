import React, { FC, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../rootReducer';
import http from '../../services/api';
import { Diary } from './../../interfaces/diary.interface';
import { addDiary } from './diariesSlice';
import Swal from 'sweetalert2';
import { setUser } from '../auth/userSlice';
import DiaryTile from './DiaryTile';
import { User } from '../../interfaces/user.interface';
import { Route, Switch } from 'react-router-dom';
import DiaryEntriesList from './DiaryEntriesList';
import { useAppDispatch } from '../../store';
import dayjs from 'dayjs';
import Button from '@material-ui/core/Button'

type results={
  result:object,
  value:string
}



const Diaries: FC = () => {
  
  
  const diaries = useSelector((state: RootState) => state.diaries);
  const user = useSelector((state: RootState) => state.user);
  
  const dispatch = useAppDispatch();

  
  useEffect(() => {
    const fetchDiaries = async () => {
      if (user) {
        http.get<null, Diary[]>(`diaries/${user.id}`)
        .then((data) => {
          console.log(data)
          if (data && data.length > 0) {
            const sortedByUpdatedAt = data.sort((a, b) => {
              return dayjs(b.updatedAt).unix() - dayjs(a.updatedAt).unix();
            });
            console.log(sortedByUpdatedAt)
            dispatch(addDiary(sortedByUpdatedAt));
          }
        });
      }
    };

    fetchDiaries();
  }, [dispatch, user]);



  const createDiary = async () => {
    const result:results = await Swal.mixin({
      input: 'text',
      confirmButtonText: 'Next &rarr;',
      showCancelButton: true,
      progressSteps: ['1', '2'],
    }).queue([
      {
        titleText: 'Diary title',
        input: 'text',
      },
      {
        titleText: 'Private or public diary?',
        input: 'radio',
        inputOptions: {
          private: 'Private',
          public: 'Public',
        },
        inputValue: 'private',
      },
    ]);
  
    if (result) {
      console.log(result)
       const { value}= result;
      const { diary, user: _user } = await http.post< Partial<Diary>, { diary: Diary; user: User }>('/diaries/', {
        title:value[0],
        type: value[1],
        userId: user?.id,
      });
      console.log(diary)
      console.log(_user)
      if (diary && user) {
        dispatch(addDiary([diary] as Diary[]));
        //dispatch(addDiary([diary] as Diary[]));
        dispatch(setUser(_user));

        return Swal.fire({
          titleText: 'All done!',
          confirmButtonText: 'OK!',
        });
      }
   }
    Swal.fire({
      titleText: 'Cancelled',
    });
  };

  

  return (
    <div style={{ padding: '1em 0.4em' }} >
      <Switch>

        <Route path="/diary/:id">
          <DiaryEntriesList />
        </Route>
        
        <Route path="/">
          <div style={{display:'flex', justifyContent:'center'}}>
          <Button onClick={createDiary}  variant="contained" >Create New Diary</Button>
          </div>
          
          <div>
          {diaries.map((diary, idx) => (
            <DiaryTile key={idx} diary={diary} />
          ))}
          </div>
          
        </Route>


        
      </Switch>
    </div>
  );
};

export default Diaries;