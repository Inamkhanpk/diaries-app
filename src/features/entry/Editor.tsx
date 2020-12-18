import React, { FC, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../rootReducer';
import Markdown from 'markdown-to-jsx';
import http from '../../services/api';
import { Entry } from '../../interfaces/entry.interface';
import { Diary } from '../../interfaces/diary.interface';
import { setCurrentlyEditing, setCanEdit } from './editorSlice';
import { updateDiary } from '../diary/diariesSlice';
import { updateEntry } from './entriesSlice';
import { showAlert } from '../../util';
import { useAppDispatch } from '../../store';
import TextField from '@material-ui/core/TextField'
import { TextareaAutosize } from '@material-ui/core';
import Button from '@material-ui/core/Button'
import classes from '*.module.css';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
  dis: {
    marginTop:theme.spacing(2)
  },
  

  
}));

const Editor: FC = () => {

  const classes = useStyles();

  const { currentlyEditing: entry, canEdit, activeDiaryId } = useSelector(
    (state: RootState) => state.editor
  );

  const [editedEntry, updateEditedEntry] = useState(entry);

  const dispatch = useAppDispatch();

  const saveEntry = async () => {
    if (activeDiaryId == null) {
      return showAlert('Please select a diary.', 'warning');
    }
    if (entry == null) {
      http
        .post<Entry, { diary: Diary; entry: Entry }>(`/diaries/entry/${activeDiaryId}`,editedEntry)
        .then((data) => {
          console.log(data)
          if (data != null) {
            const { diary, entry: _entry } = data;
            dispatch(setCurrentlyEditing(_entry));
            dispatch(updateDiary(diary));
          }
        });
    } else {
      http
        .put<Entry, Entry>(`diaries/entry/${entry.id}`, editedEntry)
        .then((_entry) => {
          if (_entry != null) {
            dispatch(setCurrentlyEditing(_entry));
            dispatch(updateEntry(_entry));
          }
        });
    }
    dispatch(setCanEdit(false));
  };

  useEffect(() => {
    updateEditedEntry(entry);
  }, [entry]);

  return (
    <div >

      
      <div className={classes.dis}>
        {entry && !canEdit ? (
          <div className={classes.dis}>
          <h4>
            {entry.title}
            <a
              href="#edit"
              onClick={(e) => {
                e.preventDefault();
                if (entry != null) {
                  dispatch(setCanEdit(true));
                }
              }}
              
            >
              (Edit)
            </a>
          </h4>
          </div>
        ) : (
          <div className={classes.dis}>
          <TextField
            label="Entry"
            variant="outlined"
            value={editedEntry?.title ?? ''}
            disabled={!canEdit}
            onChange={(e) => {
              if (editedEntry) {
                updateEditedEntry({
                  ...editedEntry,
                  title: e.target.value,
                });
              } else {
                updateEditedEntry({
                  title: e.target.value,
                  content: '',
                });
              }
            }}
          />
          </div>
        )}
        </div>
  


       <div className={classes.dis}>
      {entry && !canEdit ? (
        <Markdown>{entry.content}</Markdown>
      ) : (
        <>
      
        <div className={classes.dis}>
          <TextareaAutosize
            rowsMax={4}
            disabled={!canEdit}
            placeholder="Supports markdown!"
            value={editedEntry?.content ?? ''}
            onChange={(e) => {
              if (editedEntry) {
                updateEditedEntry({
                  ...editedEntry,
                  content: e.target.value,
                });
              } else {
                updateEditedEntry({
                  title: '',
                  content: e.target.value,
                });
              }
            }}
          />
          </div>
          <div className={classes.dis}>
          <Button onClick={saveEntry} variant="contained" disabled={!canEdit}>
            Save
          </Button>
          </div>
          
        </>
      )}

      </div>
    </div>
  );
};

export default Editor;