import React, { useEffect } from 'react';
import './App.css';
import { Autocomplete, Box, Checkbox, Grid, List, TextField, Typography } from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import { ApiFunction } from './helper/ApiFunction';
import { CharacterModel } from './models/CharacterModel';
import image from './assets/image.png';
import image2 from './assets/image2.png';
import CircularProgress from '@mui/material/CircularProgress';



const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

function App() {
  const [inputValue, setValue] = React.useState("");
  const [filteredDatas, setFilteredDatas] = React.useState<CharacterModel[]>([]);
  const [taggedData, setTaggedData] = React.useState<CharacterModel[]>([]);
  const [noOptionText, setNoOptionText] = React.useState("");

  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  useEffect(() => { // When Page first load
       async function fetchMyAPI() {
         await callFilteredCharacter(""); 
         setLoading(false);
       }

    fetchMyAPI()
  },[]);

  useEffect(() => { // Each input change, call api  
      async function fetchMyAPI() {
         await callFilteredCharacter(inputValue); 
       }

    fetchMyAPI()
  },[inputValue]);

  async function callFilteredCharacter(params: String) { // Filter Function
    let response;
    await cleanList();
    setLoading(true);
    if(params === ""){
       response = await ApiFunction("", {}, "get");
    }else{
       response = await ApiFunction(`?name=${params}`, {}, "get");
    }
    if(!(typeof response === 'string')){
      await sleep(3000); // I have added sleep for data instantly loaded and doesnt show load statement
      await setFilteredDatas(response?.data.results);
    }else{
      await sleep(3000);
      setFilteredDatas([]);
      setNoOptionText(response); // This error coming from api and no more option text added
    }
    setLoading(false);
  }

  async function cleanList() { // clean list for represent new list
     setFilteredDatas([]);
  }

  function checkedOrNot(params: number) { // When change list dont lose already selected data
    var count = taggedData.filter((data: CharacterModel) => data.id === params).length;
    return count > 0 ? true : false;
  }

  async function sleep(duration: number) {
     return new Promise((resolve: any) => {
       setTimeout(() => {
         resolve();
       }, duration);
     });
  }


 
  
  return (
    <div className="App">
      <Grid container spacing={2}>
        <Grid item xs={1} xl={4}>
        </Grid>
        <Grid item xs={10} xl={4} style={{ paddingTop: '2rem' }}>
             <img src={image} alt='' style={{ width: '40%' }}/><br></br>
             <img src={image2} alt='' style={{ width: '40%' }}/>
             <Autocomplete
               id="example_autocomplete"
               sx={{ minWidth: '100%', width: '100%', backgroundColor: 'white', padding: 0.8, borderRadius: 3 }}
               options={filteredDatas}
               autoHighlight
               multiple
               disableCloseOnSelect
               loading={loading}
               noOptionsText={noOptionText}
               open={open}
               onOpen={() => { setOpen(true); }}
               onClose={() => { setOpen(false); }}
               isOptionEqualToValue={(option, value) => option.name === value.name}
               onChange={(event, newValue) => { setTaggedData(newValue)} }
               getOptionLabel={(option) => option.name}
               renderOption={(props, option, { selected }) => {
                const matches = match(option.name, inputValue, { insideWords: true });
                const parts = parse(option.name, matches);
                let checked = checkedOrNot(option.id);

                return (
                 <li {...props}>
                       <Checkbox
                         icon={icon}
                         checkedIcon={checkedIcon}
                         style={{ marginRight: 8 }}
                         checked={checked}
                       />
                         <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }}>
                           <img
                             loading="lazy"
                             width="90"
                             srcSet={`${option.image} 2x`}
                             src={`${option.image}`}
                             alt=''
                           />
                       </Box>
                           <List>
                              {parts.map((part, index) => (
                                 <span
                                      key={index}
                                      style={{
                                        fontWeight: part.highlight ? 700 : 400,
                                      }}
                                    >
                                      {part.text}
                                    </span>
                              ))}
                             <Typography variant="caption" display="block" gutterBottom>{option.episode.length} Episodes</Typography>
                           </List>
                 </li>
               )}
               }
               renderInput={(params) => (
                        <TextField
                           {...params}
                           label="Filter Character Name"
                           value={inputValue}
                           onChange={(event: any) => {setValue(event.target.value)}}
                           InputProps={{
                             ...params.InputProps,
                             endAdornment: (
                               <React.Fragment>
                                 {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                 {params.InputProps.endAdornment}
                               </React.Fragment>
                             ),
                           }}
                         />
               )}
             />
        </Grid>
        <Grid item xs={1} xl={4}>
        </Grid>
      </Grid>
   
    </div>
  );
}

export default App;
