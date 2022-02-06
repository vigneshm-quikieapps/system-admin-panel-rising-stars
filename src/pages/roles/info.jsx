import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import {
  AccordionDetails,
  AccordionSummary,
  Box,
  CircularProgress,
  Divider,
  Typography,
} from "@mui/material";
import {
  Accordion,
  Card,
  CardTitle,
  IconButton,
  ImgIcon,
  Output,
  Outputs,
  FormCheckbox as Checkbox,
  Table,
} from "../../components";
import { backIcon } from "../../assets/icons";
import { useGetRole } from "../../services/queries";
import { toPascal, transformError } from "../../utils";
import Privileges from "./components/privileges";
import { privilegeTypes } from "../../helper/constants";

const RoleDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data = { role: {} }, isLoading, isError, error } = useGetRole(id);
  console.log("roleData", data);
  const {
    role: { name, code, description, _id },
  } = data;
  const items = {
    "Role Name": toPascal(name),
    "Role Code": code,
    Description: toPascal(description),
  };
  const functionalPrivileges = data.role.functionalPrivileges;

  const { control } = useForm({
    resolver: yupResolver(),
    defaultValues: {
      functionalPrivileges: Object.keys(privilegeTypes).map((type) => ({
        type,
        permission:
          data.role.functionalPrivileges[
            data.role.functionalPrivileges.findIndex(
              ({ type: privilegeType }) => privilegeType === type,
            )
          ].permission,
      })),
    },
  });

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
        <IconButton onClick={() => navigate("../")}>
          <ImgIcon>{backIcon}</ImgIcon>
        </IconButton>
        <Typography
          variant="h3"
          sx={{ fontSize: "20px", fontWeight: "bold", ml: 1 }}
        >
          Role Definition
        </Typography>
      </Box>
      <Box>
        <Card>
          {isError ? (
            <Typography color="error" component="pre">
              {"Something went wrong: " + transformError(error)}
            </Typography>
          ) : isLoading ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "200px",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <>
              <CardTitle>{toPascal(name)}</CardTitle>{" "}
              <Typography
                sx={{
                  color: (theme) => theme.palette.text.secondary,
                }}
              >
                Role ID
              </Typography>
              <Typography
                sx={{
                  color: (theme) => theme.palette.text.secondary,
                  fontWeight: "bold",
                  mb: "10px",
                }}
              >
                {toPascal(_id)}
              </Typography>
              <Outputs items={data.role?.name ? items : []} columnCount={3} />
            </>
          )}
        </Card>
      </Box>
      <Privileges control={control} />
    </>
  );
};

export default RoleDetail;
