import React, { FC, useState } from 'react';
import { Diary } from '../../interfaces/diary.interface';
import http from '../../services/api';
import { updateDiary } from './diariesSlice';
import {
  setCanEdit,
  setActiveDiaryId,
  setCurrentlyEditing,
} from '../entry/editorSlice';
import { showAlert } from './../../util';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../../store';
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

interface Props {
  diary: Diary;
}



const DiaryTile: FC<Props> = (props) => {

  const [diary, setDiary] = useState(props.diary);
  const [isEditing, setIsEditing] = useState(false);

  const dispatch = useAppDispatch();

  const totalEntries = props.diary?.entryIds?.length;

  const saveChanges = () => {
    http
      .put<Diary, Diary>(`/diaries/${diary.id}`, diary)
      .then((diary) => {
        if (diary) {
          dispatch(updateDiary(diary));
          showAlert('Saved!', 'success');
        }
      })
      .finally(() => {
        setIsEditing(false);
      });
  };

  return (
    <div className="diary-tile">



      <h2
        className="title"
        title="Click to edit"
        onClick={() => setIsEditing(true)}
        style={{
          cursor: 'pointer',
        }}
      >



        {isEditing ? (
          <TextField
            value={diary.title}
            onChange={(e) => {
              setDiary({
                ...diary,
                title: e.target.value,
              });
            }}
            onKeyUp={(e) => {
              if (e.key === 'Enter') {
                saveChanges();
              }
            }}
          />
        ) : (
          <span>{diary.title}</span>
        )}
      </h2>



      <p >{totalEntries ?? '0'} SAVED ENTRIES</p>

      <div >


        <Button
          variant="contained"
          onClick={() => {
            dispatch(setCanEdit(true));
            dispatch(setActiveDiaryId(diary.id as string));
            dispatch(setCurrentlyEditing(null));
          }}
        >
          Add New Entry
        </Button>



        <Link to={`diary/${diary.id}`} >
          <Button variant="contained">
            View all &rarr;
          </Button>
        </Link>


      </div>
    </div>
  );
};

export default DiaryTile;