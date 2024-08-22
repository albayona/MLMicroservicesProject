import * as React from 'react';
import {AppBar, Button, TextField, Toolbar} from "@mui/material";
import {SCRAPE_HOST} from "../hooks/UseFetch";
import {useAuth} from "../contexts/UserContext";
import {TabSelector} from "../components/TabSelector";


export default function MainPage() {

    const [scrapeUrl, setScrapeUrl] = React.useState('https://www.facebook.com/marketplace/108610652496213/vehicles?maxPrice=4000&maxMileage=200000&minYear=2007&carType=suv&transmissionType=automatic&exact=false');
    const {token} = useAuth();
    const {user} = useAuth();
    const [tabsIndexes, setTabsIndexes] = React.useState([0, 1, 2]);



    function scrape() {
        if (scrapeUrl) {
            fetch(`${SCRAPE_HOST}/scrape/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'X-Consumer-Custom-Id': user,
                },
                body: JSON.stringify({link: scrapeUrl})
            })
                .then(response => {
                    if (!response.ok) {
                        // error coming back from server
                        throw Error('Could not update car');
                    }

                    return response.json();
                })
                .then(() => {
                    console.log('Scrape successful');
                })
                .catch(err => {
                    console.log(err.message);
                })
        }
    }

    return (
        <React.Fragment>
            <AppBar position="static">
                <Toolbar variant="dense">
                    <Button onClick={scrape} variant="contained" color="secondary">Scrape</Button>
                    <TextField
                        id="filled-basic"
                        label="Scrape Url"
                        value={scrapeUrl}
                        onChange={(event) => {
                            setScrapeUrl(event.target.value);
                        }}
                        variant="filled"
                        fullWidth
                    />
                </Toolbar>
            </AppBar>

            <TabSelector tabs={tabsIndexes}/>
        </React.Fragment>
    );
}