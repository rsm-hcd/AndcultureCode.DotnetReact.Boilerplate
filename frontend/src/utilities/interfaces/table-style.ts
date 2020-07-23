import { TableCellAlignmentStyle } from "utilities/enumerations/table-cell-align-style";
import { TableCellBorderStyle } from "utilities/interfaces/table-cell-border-style";
import { TableCellVerticalAlignmentStyle } from "utilities/enumerations/table-cell-vertical-align-style";

/**
 * Describes the re-structured cod-style attribute values found in the xml
 * @property borderStyle Decribes top/right/bottom/left border settings
 * @property cellAlign Describes how text is aligned within the cell
 * @property charDecimalAlign Describes if cell values to be aligned by decimal place
 * @property vAlign Describes vertical alignment style property for the cell
 */
export default interface TableStyle {
    borderStyle?: TableCellBorderStyle;
    cellAlign?: TableCellAlignmentStyle;
    vAlign?: TableCellVerticalAlignmentStyle;
    charDecimalAlign?: boolean;
}
