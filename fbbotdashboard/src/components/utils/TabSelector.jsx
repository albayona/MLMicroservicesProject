import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import {RootGroupProvider} from "../../contexts/GroupContext";
import {GenericCarOrGroupTable} from "../GenericCarOrGroupTable";
import ArchiveCarsTable from "../CarTable/ArchiveCarsTable";
import ArchiveIcon from '@mui/icons-material/Archive';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import {UpdateProvider} from "../../contexts/UpdateContext";
import {RegExRoot} from "../RegExGroup";
import {RegexProvider} from "../../contexts/RegexContext";


export const CustomTabPanel = (props) => {
    const {children, selectedIndex, index, unmount, ...other} = props;
    const render = !unmount || selectedIndex === index;

    return (<div
        role="tabpanel"
        hidden={selectedIndex !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
    >
        {render && <Box sx={{p: 3}}>{children}</Box>}
    </div>);
}


CustomTabPanel.propTypes = {
    children: PropTypes.node, index: PropTypes.number.isRequired, selectedIndex: PropTypes.number.isRequired,
};


export const TabSelector = ({tabs}) => {
    const [tabIndex, setTabIndex] = React.useState(0);


    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    return (<Box sx={{width: '100%'}}>
        <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
            <Tabs value={tabs[tabIndex]} onChange={handleChange} aria-label="icon label tabs">
                <Tab icon={<MarkEmailUnreadIcon/>} label="New"/>
                <Tab icon={<ArchiveIcon/>} label="Archived"/>
                <Tab icon={<FavoriteIcon/>} label="Favorites"/>
            </Tabs>
        </Box>
        <UpdateProvider>
            <CustomTabPanel selectedIndex={tabs[tabIndex]} index={0} unmount={false}>
                <RootGroupProvider>
                    <GenericCarOrGroupTable/>
                </RootGroupProvider>
            </CustomTabPanel>
            <CustomTabPanel selectedIndex={tabs[tabIndex]} index={1} unmount={true}>
                <ArchiveCarsTable type="Old"/>
            </CustomTabPanel>
            <CustomTabPanel selectedIndex={tabs[tabIndex]} index={2} unmount={true}>
                {/*<ArchiveCarsTable type="Favs"/>*/}
                <RegexProvider>
                    <RegExRoot/>
                </RegexProvider>
            </CustomTabPanel>
        </UpdateProvider>
    </Box>)


}