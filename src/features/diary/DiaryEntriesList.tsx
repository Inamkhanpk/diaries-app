import React, { FC, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../rootReducer';
import http from '../../services/api';
import { Entry } from '../../interfaces/entry.interface';
import { setEntries } from '../entry/entriesSlice';
import { setCurrentlyEditing, setCanEdit } from '../entry/editorSlice';
import dayjs from 'dayjs';
import { useAppDispatch } from '../../store';
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
 linkend:{
   display:'flex',
   justifyContent:'flex-end'
 },
 lists:{
  listStyle: 'none',
  padding: 0,
 },
 listentry:{
  borderTop:'1px solid rgba(0, 0, 0, 0.1)',
  padding: '0.5em',
  cursor: 'pointer',
 }
 
}));

const DiaryEntriesList: FC = () => {
  const classes = useStyles();
  const { entries } = useSelector((state: RootState) => state);
  const dispatch = useAppDispatch();
  const { id } = useParams();




  useEffect(() => {
    if (id !== null) {
      http
        .get<null, { entries: Entry[] }>(`/diaries/entries/${id}`)
        .then(({ entries: _entries }) => {
          if (_entries) {
            const sortByLastUpdated = _entries.sort((a, b) => {
              return dayjs(b.updatedAt).unix() - dayjs(a.updatedAt).unix();
            });
            dispatch(setEntries(sortByLastUpdated));
          }
        });
    }
  }, [id, dispatch]);



  return (
    <div >

      <div>
       <List >
        {entries.map((entry) => (
         
          <ListItem   key={entry.id}
          onClick={() => {
            dispatch(setCurrentlyEditing(entry));
            dispatch(setCanEdit(true));
          }}>
            
          
            {entry.title}
            </ListItem>
        
        ))}
        </List>
        </div>

       <div className={classes.linkend}>
         <Link to="/">
          <h3>&larr; Go Back</h3>
        </Link>
        </div>

    </div>
  );
};

export default DiaryEntriesList;