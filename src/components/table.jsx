import { styled } from "@mui/material/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import { Box } from "@mui/system";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    fontWeight: "bold",
  },
  [`&.${tableCellClasses.root}`]: { border: 0 },
}));

const CustomContainer = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.palette.highlight.main}`,
  borderRadius: theme.shape.borderRadiuses.secondary,
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  cursor: "pointer",
  border: 0,
  height: 70,
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.highlight.main,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export const TableHeading = ({
  title,
  children,
  titleComponent = "h3",
  titleSx = { fontSize: "20px", fontWeight: "bold", flexGrow: "1" },
}) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      px: 2,
      py: 1.5,
      borderBottom: (theme) => `1px solid ${theme.palette.highlight.main}`,
    }}
  >
    <Typography component={titleComponent} sx={titleSx}>
      {title}
    </Typography>
    <Box sx={{ display: "flex", gap: 1 }}>{children}</Box>
  </Box>
);

const CustomTable = ({ heading, headers, rows, pagination }) => {
  return (
    <CustomContainer>
      {heading}
      <TableContainer component={"div"}>
        <Table>
          <TableHead>
            <TableRow>
              {headers.map((header, index) => (
                <StyledTableCell key={index} component="th">
                  {header}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <StyledTableRow key={row.id || index} onClick={row.onClick}>
                {row.items.map((item, index) => (
                  <StyledTableCell key={index}>{item}</StyledTableCell>
                ))}
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ m: 1 }}>{pagination}</Box>
    </CustomContainer>
  );
};
export default CustomTable;
