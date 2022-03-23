import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { Close as CloseIcon } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import {
  AccordionSummary,
  AccordionDetails,
  Box,
  MenuItem,
  Typography,
  DialogActions,
  IconButton,
  Menu,
  Dialog,
  DialogContent,
  DialogTitle,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Done as DoneIcon,
  Save as AddIcon,
  Undo as RestoreDefaultsIcon,
  ClearRounded as CancelIcon,
} from "@mui/icons-material";
import informationIcon from "../../assets/icons/icon-information.png";
import warningIcon from "../../assets/icons/icon-warning.png";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import errorIcon from "../../assets/icons/icon-error.png";
import {
  GradientButton,
  Grid,
  AddButton,
  Accordion,
  AccordionContainer,
  Card,
  CardRow,
  DashboardCard,
  TextField,
  CheckBox,
  ImgIcon,
  Input,
  WarningDialog,
  Button,
  ElevationScroll,
} from "../../components";
import { useNavigate } from "react-router-dom";
import { backIcon } from "../../assets/icons";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import deleteIcon from "../../assets/icons/icon-delete.png";
import { number } from "yup/lib/locale";
import { CenterFocusStrong } from "@mui/icons-material";
import { useEvaluationSchemesQuery } from "../../services/list-services";
import { useGetEvaluation } from "../../services/queries";
import {
  updateEvaluation,
  createEvaluation,
} from "../../services/businessServices";
import { fontSize } from "@mui/system";

const FormModal = styled(Dialog)(({ theme }) => ({
  "& .MuiPaper-root": { borderRadius: theme.shape.borderRadiuses.ternary },
  "& label": { lineHeight: "initial !important" },
}));

const validationSchema = yup
  .object()
  .shape({
    evaluationName: yup.string(),
    status: yup.string().oneOf(["ACTIVE", "NOT_ACTIVE"]),
    levelCount: yup.number(),
  })
  .required();

const Page = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [evaluationId, setEvaluationId] = useState();
  const [showWarning, setShowWarning] = useState(false);
  const [level, setLevel] = useState([]);
  const [message, setMessage] = useState();
  const [isSkillSaved, setIsSkillSaved] = useState(false);
  const [saveStatus, setSaveStatus] = useState(false);
  const [onSaveUpdateStatus, setOnSaveUpdateStatus] = useState(false);
  const [icon, setIcon] = useState();
  const [title, setTitle] = useState();
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState("");

  const { data, isLoading, isFetching, isPreviousData } = useGetEvaluation(id, {
    // onSuccess: console.log("LOL"),
    // refetchOnWindowFocus: false,
    // refetchOnReconnect: false,
    onError: (error) => {
      setShowError(true);
      setError(error);
    },
  });

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(validationSchema),
    reValidateMode: "onChange",
    defaultValues: {
      evaluationName: "",
      status: "ACTIVE",
      levelCount: 1,
    },
  });

  useEffect(() => {
    console.log("useEffect called");
    if (id) {
      const temp = data?.evaluationScheme;
      if (temp) {
        setValue("evaluationName", temp?.name || "");
        setValue("status", temp?.status || "ACTIVE");
        setValue("levelCount", temp?.levelCount || 0);
        setLevel(
          temp?.levels || [
            { skills: [], isAddNewSkill: true, add: false, touched: false },
          ],
        );
        setEvaluationId(temp?._id);
      }
    } else {
      setValue("evaluationName", "");
      setValue("status", "ACTIVE");
      setValue("levelCount", 0);
      // setLevel([
      //   { skills: [], isAddNewSkill: true, add: false, touched: false },
      // ]);
    }
  }, [data]);

  const onSubmit = async () => {
    let message1;
    if (evaluationId !== "") {
      await updateEvaluation(evaluationId, {
        name: control._formValues.evaluationName,
        status: control._formValues.status,
        levelCount: control._formValues.levelCount,
        levels: level,
      })
        .then((res) => {
          message1 = res;
          setMessage(message1?.data?.message);
        })
        .catch((error) => {
          setMessage("Name should be at least 3 char unique");
        });

      setOnSaveUpdateStatus(true);

      if (message1?.data?.message === "update successful") {
        setIcon(informationIcon);
        setTitle("Information");
      } else {
        setIcon(errorIcon);
        setTitle("Error");
      }
    } else {
      await createEvaluation({
        name: control._formValues.evaluationName,
        status: control._formValues.status,
        levelCount: control._formValues.levelCount,
        levels: level,
      })
        .then((res) => {
          message1 = res;
          setMessage(message1?.data?.message);
        })
        .catch((error) => {
          setMessage("Name should be at least 3 char unique");
        });

      setOnSaveUpdateStatus(true);
      if (message1?.data?.message === "created successfully") {
        setIcon(informationIcon);
        setTitle("Information");
      } else {
        setIcon(errorIcon);
        setTitle("Error");
        // setMessage("Name should be at least 3 char unique");
      }
      setOnSaveUpdateStatus(true);
    }
  };
  // console.log(message);
  const addNewSkill = (index) => {
    const newState = [...level];
    newState[index].isAddNewSkill = true;
    newState[index].add = true;
    newState[index].touched = false;
    setLevel(newState);
  };
  const handleClose = () => navigate("/evaluation");
  const handleDiscard = () => {
    setShowWarning(true);
  };
  const handleOnClickSubmitEvaluation = (title) => {
    if (title === "Error") {
      setOnSaveUpdateStatus(false);
    } else {
      setOnSaveUpdateStatus(false);
      navigate("/evaluation");
    }
  };
  const handleOnClickSubmitWithoutSaving = () => {
    setIsSkillSaved(false);
  };

  const [label, setlabel] = useState(0);
  const tempHandler = () => {
    let temp = label + 1;
    setlabel(temp);
  };
  return (
    <>
      <FormModal open={true} maxWidth="xl">
        <ElevationScroll>
          <DialogTitle
            sx={{
              fontSize: "28px",
              fontWeight: "bold",
              zIndex: 1,
            }}
          >
            Evaluation
          </DialogTitle>
        </ElevationScroll>
        <IconButton
          onClick={handleDiscard}
          sx={{
            position: "absolute",
            top: "10px",
            right: "10px",
            bgcolor: "ternary.main",
            zIndex: 1,
          }}
        >
          <CloseIcon />
        </IconButton>
        {/* <ElevationScroll targetRef={contentRef}> */}
        {isLoading && (
          <Box
            sx={{
              display: "flex",
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#0009",
              pointerEvents: "none",
              zIndex: 2,
            }}
          >
            <CircularProgress />
          </Box>
        )}
        <Box sx={{ margin: "5%" }}>
          <Grid columnspace={5}>
            <Input
              label="Evaluation Name"
              type="text"
              control={control}
              name="evaluationName"
              variant="filled"
              sx={{ width: "100%" }}
            />

            <Input
              label="Status"
              control={control}
              name="status"
              select
              sx={{ width: "100%" }}
              variant="filled"
            >
              <MenuItem value="ACTIVE">Active</MenuItem>
              <MenuItem value="NOT_ACTIVE">Not Active</MenuItem>
            </Input>

            <Input
              sx={{ width: "100%" }}
              label="Level Count"
              control={control}
              name="levelCount"
              type="number"
              InputProps={{ inputProps: { min: "0", max: "10", step: "1" } }}
              variant="filled"
              onChange={(data) => {
                let temp = [...level];
                if (temp.length > data.target.value) {
                  temp.pop();
                  setValue("levelCount", data.target.value);
                  setLevel(temp);
                } else if (
                  data.target.value &&
                  temp.length < data.target.value
                ) {
                  setValue("levelCount", data.target.value);
                  for (var i = temp.length; i < data.target.value; i++) {
                    temp.push({ skills: [], isAddNewSkill: true });
                  }
                  setLevel(temp);
                } else {
                }
              }}
            ></Input>
          </Grid>
        </Box>
        <Box sx={{ margin: "5%" }}>
          {level?.map((data, index1) => (
            <AccordionContainer key={index1}>
              <Accordion defaultExpanded={true}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box
                    sx={{
                      display: "flex",
                      flex: 1,
                      alignItems: "center",
                    }}
                  >
                    <Typography style={{ flex: 1 }}>
                      Level {index1 + 1}
                    </Typography>
                    <AddButton
                      key={index1}
                      style={{ marginRight: "1%" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        addNewSkill(index1);
                        setSaveStatus(true);
                      }}
                    />
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ padding: " 5px 17px" }}>
                    <Typography
                      style={{
                        fontSize: "18px",
                        fontWeight: "bold",
                        display: "inline",
                      }}
                    >
                      Skill Name
                    </Typography>
                    <Typography
                      style={{
                        marginRight: "5%",
                        fontSize: "18px",
                        fontWeight: "bold",
                        float: "right",
                        display: "inline",
                      }}
                    >
                      Action
                    </Typography>
                  </Box>
                </AccordionDetails>
                {data?.isAddNewSkill && (
                  <AccordionDetails>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-around",
                        flexDirection: "row",
                      }}
                    >
                      <TextField
                        sx={{
                          height: "44px",
                          "& .MuiFilledInput-input": { py: 0 },
                          width: "80%",
                        }}
                        required
                        id="newSkill"
                        placeholder="Enter Skill"
                        label="Add New Skill"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            const temp = [...level];
                            if (e.target.value !== "") {
                              temp[index1].skills.unshift(e.target.value);
                              setLevel(temp);
                              const newState = [...level];
                              newState[index1].isAddNewSkill = false;
                              setLevel(newState);
                              setSaveStatus(false);
                            }
                          }
                        }}
                      ></TextField>
                      <Box sx={{ width: "10%", marginLeft: "9%" }}>
                        {data?.isAddNewSkill && (
                          <IconButton
                            onClick={() => {
                              const newState = [...level];
                              // if (newState[index1].skills[0].skill !== "") {
                              newState[index1].isAddNewSkill = false;
                              setLevel(newState);
                              // }
                              // newState[index1].isAddNewSkill = true;
                              setSaveStatus(false);
                            }}
                          >
                            <CancelIcon color="secondary" />
                          </IconButton>
                        )}
                        <IconButton
                          onClick={() => {
                            const newState = [...level];
                            if (
                              document.getElementById("newSkill").value.length >
                              0
                            ) {
                              newState[index1].skills.unshift(
                                document.getElementById("newSkill").value,
                              );
                              newState[index1].isAddNewSkill = false;
                              setLevel(newState);
                              setSaveStatus(false);
                            } else {
                              document.getElementById(
                                "errorText",
                              ).style.display = "block";
                              newState[index1].isAddNewSkill = true;
                              setSaveStatus(true);
                            }
                          }}
                        >
                          <AddIcon />
                        </IconButton>
                      </Box>
                    </Box>
                    <Box
                      id="errorText"
                      style={{
                        display: "none",
                        color: "red",
                        fontSize: "10px",
                        marginTop: "10px",
                        marginLeft: "10px",
                      }}
                    >
                      Please enter some text (atleast 3 letter) before SAVING
                    </Box>
                  </AccordionDetails>
                )}

                {data.skills.map((skill, index2) => (
                  <AccordionDetails>
                    <Box>
                      <TextField
                        sx={{
                          height: "44px",
                          "& .MuiFilledInput-input": { py: 0 },
                          width: "80%",
                        }}
                        required
                        key={index2}
                        value={skill}
                        placeholder="Enter Skill"
                        onChange={(e) => {
                          const temp = [...level];
                          temp[index1].skills[index2] = e.target.value;
                          setLevel(temp);
                        }}
                      ></TextField>
                      <IconButton
                        style={{
                          marginRight: "7%",
                          float: "right",
                        }}
                        onClick={() => {
                          const temp = [...level];
                          temp[index1].skills.splice(index2, 1);
                          setLevel(temp);
                        }}
                      >
                        <ImgIcon>{deleteIcon}</ImgIcon>
                      </IconButton>
                    </Box>
                  </AccordionDetails>
                ))}
              </Accordion>
            </AccordionContainer>
          ))}
        </Box>
        <Box sx={{ display: "flex", gap: 2, py: 2, margin: "5%" }}>
          <GradientButton
            disabled={saveStatus}
            onClick={() => {
              if (!level.some((data) => data.isAddNewSkill)) {
                onSubmit();
              } else {
                setIsSkillSaved(true);
              }
            }}
            size="large"
          >
            Save
          </GradientButton>
          <GradientButton
            onClick={handleDiscard}
            sx={{
              "&:hover": {
                backgroundImage:
                  "linear-gradient(106deg, #ff1a6d, #ff6e2d 100%)",
                color: "white",
              },
            }}
            size="large"
            invert
          >
            Discard
          </GradientButton>
        </Box>
        {/* <GradientButton
          disabled={saveStatus}
          size="large"
          sx={{
            maxWidth: "fit-content",
            marginRight: "10px",
            marginTop: "20px",
          }}
          onClick={() => {
            if (!level.some((data) => data.isAddNewSkill)) {
              onSubmit();
            } else {
              setIsSkillSaved(true);
            }
          }}
        >
          Save
        </GradientButton>
        <GradientButton
          onClick={handleDiscard}
          invert
          size="large"
          sx={{
            maxWidth: "fit-content",
            marginRight: "10px",
            marginTop: "20px",
          }}
        >
          Discard
        </GradientButton> */}
        {/* </DialogContent> */}
        {!!Object.keys(errors).length && (
          <DialogActions
            sx={{ flexDirection: "column", alignItems: "flex-start", p: 2 }}
          >
            {Object.values(errors)
              .reverse()
              .map(({ message }, index) => (
                <Typography
                  key={index}
                  sx={{ color: "error.main", ml: "0 !important" }}
                  component="span"
                >
                  {message}
                </Typography>
              ))}
          </DialogActions>
        )}
        {/* </FormModal> */}
        <WarningDialog
          showReject
          open={showWarning}
          onAccept={handleClose}
          onReject={() => setShowWarning(false)}
          title="Warning"
          description="Are you sure you want to discard without saving?"
        />
        <Dialog
          open={isSkillSaved}
          sx={{
            "& .MuiDialog-paper": {
              minWidth: "380px",
              padding: "40px 30px",
              margin: "27px 300px 31px 200px",
              alignItems: "center",
              borderRadius: "20px",
            },
          }}
        >
          <ImgIcon>{errorIcon}</ImgIcon>
          <DialogTitle>Error</DialogTitle>
          <DialogContent>
            Please save the new changes done before SAVING
          </DialogContent>
          <DialogActions>
            <Button
              sx={{
                color: "#ff2c60",
                border: "solid 1px #f2f1f6",
                textTransform: "none",
                fontSize: "20px",
                fontWeight: "600px",
                borderRadius: "12px",
                width: "100px",
              }}
              onClick={handleOnClickSubmitWithoutSaving}
              autoFocus
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={onSaveUpdateStatus}
          sx={{
            "& .MuiDialog-paper": {
              minWidth: "380px",
              padding: "40px 30px",
              margin: "27px 300px 31px 200px",
              alignItems: "center",
              borderRadius: "20px",
            },
          }}
        >
          <ImgIcon>{icon}</ImgIcon>
          <DialogTitle>{title}</DialogTitle>
          <DialogContent>{message}</DialogContent>
          <DialogActions>
            <Button
              sx={{
                color: "#ff2c60",
                border: "solid 1px #f2f1f6",
                textTransform: "none",
                fontSize: "20px",
                fontWeight: "600px",
                borderRadius: "12px",
                width: "100px",
              }}
              onClick={() => {
                handleOnClickSubmitEvaluation(title);
              }}
              autoFocus
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>
        {/* 
        <DialogContent>{label}</DialogContent>
        <DialogActions>
          <Button
            sx={{ color: "#ff2c60" }}
            onClick={() => {
              tempHandler();
            }}
            autoFocus
          >
            Ok
          </Button>
        </DialogActions>
        </ElevationScroll> */}
      </FormModal>
    </>
  );
};

export default Page;
