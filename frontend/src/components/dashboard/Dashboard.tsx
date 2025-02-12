import * as React from "react";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import DashboardIcon from "@mui/icons-material/Dashboard";

// Tree Map
import { DateContext } from "../Treemap/Context/DateContext/DateContext";
import TreemapContainer from "../Treemap/Components/Treemap/TreemapContainer";
import NewDateRangePicker from "./NewDateRange";
import Sankey from "../Sankey/Sankey";
import { useContext } from "react";
import IntroPage from "../Introduction/intro";

const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}
// most of this code is from the material ui example, https://mui.com/material-ui/react-app-bar/
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const mdTheme = createTheme();

function DashboardContent() {
  const [open, setOpen] = React.useState(true);
  const [selectedMenu, setSelectedMenu] = React.useState("Dashboard"); // Default selected menu item
  const { startDate, endDate } = useContext(DateContext);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleMenuClick = (menuItem: any) => {
    setSelectedMenu(menuItem);
  };

  // Content through the navigation pane goes here.
  const renderContent = () => {
    switch (selectedMenu) {
      case "TreeMap":
        return (
          <div>
            <h1>TreeMap</h1>
            <TreemapContainer />
          </div>
        );
      case "Sankey":
        return (
          <div>
            <h1>Sankey</h1>
            <Sankey
              date={{
                start: startDate.format("YYYY-MM-DD"),
                end: endDate.format("YYYY-MM-DD"),
              }}
            />
          </div>
        );
      case "Introduction":
        return (
          <div>
            <h1>Introduction</h1>
            <IntroPage />
          </div>
        );
      default:
        return (
          <div>
            <h1>Introduction</h1>
            <IntroPage />
          </div>
        );
    }
  };

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: "24px", // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              2AMV10 GasTech
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            <ListItemButton
              onClick={() => handleMenuClick("Introduction")}
              selected={selectedMenu === "Introduction"}
            >
              <ListItemIcon>
                <KeyboardIcon />
              </ListItemIcon>
              <ListItemText primary="Introduction" />
            </ListItemButton>
            <ListItemButton
              onClick={() => handleMenuClick("TreeMap")}
              selected={selectedMenu === "TreeMap"}
            >
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="TreeMap" />
            </ListItemButton>
            <ListItemButton
              onClick={() => handleMenuClick("Sankey")}
              selected={selectedMenu === "Sankey"}
            >
              <ListItemIcon>
                <ShowChartIcon />
              </ListItemIcon>
              <ListItemText primary="Sankey" />
            </ListItemButton>
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <NewDateRangePicker />
            {renderContent()}
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default function Dashboard() {
  return <DashboardContent />;
}
