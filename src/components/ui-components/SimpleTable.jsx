import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});




export default function BasicTable(props) {
  const classes = useStyles();
  console.log(props.headings)
 // if(props.headings.length == 0 || props.rows.length) return null;




  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            {
                props.headings.map((h,index) => {
                    return (<TableCell key={index} align="left">{h}</TableCell>)
                })
            }
          </TableRow>
        </TableHead>
        <TableBody>
          {props.rows.map((row,index) => (
            <TableRow key={index}>
                {row.data.map((cell,index) => {
                    return <TableCell key={index} align="left">{cell}</TableCell>
                })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}