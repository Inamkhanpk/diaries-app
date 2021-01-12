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
import { makeStyles } from '@material-ui/core/styles';

interface Props {
  diary: Diary;
}

const useStyles = makeStyles((theme) => ({
  
  title:{
    textAlign:'center',
    [theme.breakpoints.down('md')]: {

      fontSize:'1.2rem'
    },
  },
  dis:{
    display:'flex',
    justifyContent:"space-between",
    [theme.breakpoints.down('md')]: {
      justifyContent:'center',
      flexDirection:'column'
    },
  },
  hcenter:{
    display:'flex',
    justifyContent:'center'
  },
  mid:{
    margin:theme.spacing(1)
  }

 
}));

const DiaryTile: FC<Props> = (props) => {
  const classes = useStyles();
  const [diary, setDiary] = useState(props.diary);
  const [isEditing, setIsEditing] = useState(false);

  const dispatch = useAppDispatch();

  const totalEntries = props.diary?.entryIds?.length;

  const saveChanges = () => {
    http.put<Diary, Diary>(`/diaries/${diary.id}`, diary)
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
    <div >



      <h2
        title="Click to edit"
        onClick={() => setIsEditing(true)}
        className={classes.title}
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
          <div>
          <span>Diary Title:</span>
          <span>{diary.title}</span>
          </div>
        )}

      </h2>



      <p className={classes.hcenter}>{totalEntries ?? '0'} SAVED ENTRIES</p>

      <div className={classes.dis}>
      <div className={classes.mid}>
        <Button
          variant="contained"
          onClick={() => {
            dispatch(setCanEdit(true));
            dispatch(setActiveDiaryId(diary.id as string));
            dispatch(setCurrentlyEditing(null));
          }}
        >
           New Entry
        </Button>
        </div>

       <div className={classes.mid}>
        <Link to={`diary/${diary.id}`} >
          <Button variant="contained">
            View all &rarr;
          </Button>
        </Link>
        </div>
        </div>

      
    </div>
  );
};

export default DiaryTile;