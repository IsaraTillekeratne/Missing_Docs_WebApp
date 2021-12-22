import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import MemberListDropDown from './MemberListDropDown';
import LeaderSelect from './LeaderSelect';
import { useSelector } from 'react-redux';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';

const steps = [
    {
        label: 'Select a Team Leader',
        description: `In order to create a team, first choose a leader.`,
    },
    {
        label: 'Add Members',
        description:
            'Select any number of unassigned members.',
    },
    {
        label: 'Confirm Team',
        description: `Please confirm`,
    },
];

export default function CreateTeamForm() {
    let navigate = useNavigate();
    const selectedLeader = useSelector((state) => state.leader.value);
    const selectedMembers = useSelector((state) => state.members.value);

    const [activeStep, setActiveStep] = React.useState(0);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    const createTeam = () => {
        if (selectedLeader === '') alert('Please select a leader')
        else if (selectedMembers.length === 0) alert('Please select members')
        else {
            Axios.put(`${process.env.REACT_APP_SERVER}/Admin/createTeam`, {
                leaderId: selectedLeader,
                members: selectedMembers,
            }, {
                headers: {
                    "x-access-token": localStorage.getItem("token")
                }
            })
                .then((response) => {
                    if (response.data.error) {
                        alert(response.data.error);
                        if ((response.data.auth) && (response.data.auth === false)) {
                            navigate('/Signin');
                        }
                    } else {
                        alert(response.data);
                    }
                })
        }
    };

    return (
        <Box sx={{ maxWidth: 1050 }}>
            <Stepper activeStep={activeStep} orientation="horizontal">
                {steps.map((step, index) => (
                    <Step key={step.label}>
                        <StepLabel
                            optional={
                                index === 2 ? (
                                    <Typography variant="caption">Last step</Typography>
                                ) : null
                            }
                        >
                            {step.label}
                        </StepLabel>

                        <Typography>{step.description}</Typography>
                        <Box sx={{ mb: 2 }}>
                            <div>

                                {index === 0 ? <LeaderSelect /> : null}
                                {index === 1 ? <MemberListDropDown /> : null}
                                {index === 2 ? <Button
                                    variant="contained"
                                    onClick={createTeam}
                                    sx={{ mt: 1, mr: 1 }}
                                >
                                    Finish
                                </Button> : <Button
                                    variant="contained"
                                    onClick={handleNext}
                                    sx={{ mt: 1, mr: 1 }}
                                >
                                    Continue
                                </Button>}

                                <Button
                                    disabled={index === 0}
                                    onClick={handleBack}
                                    sx={{ mt: 1, mr: 1 }}
                                >
                                    Back
                                </Button>
                            </div>
                        </Box>

                    </Step>
                ))}
            </Stepper>
            {activeStep === steps.length && (
                <Paper square elevation={0} sx={{ p: 3 }}>
                    <Typography>All steps completed - you created a new team.</Typography>
                    <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                        Reset
                    </Button>
                </Paper>
            )}
        </Box>
    );
}
