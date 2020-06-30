import { ReactComponent as Checkmark } from "assets/icons/16px/Checkmark.svg";
import { ReactComponent as ChevronDown16 } from "assets/icons/16px/Chevron-Down.svg";
import { ReactComponent as ChevronLeft16 } from "assets/icons/16px/Chevron-Left.svg";
import { ReactComponent as ChevronRight16 } from "assets/icons/16px/Chevron-Right.svg";
import { ReactComponent as ChevronUp16 } from "assets/icons/16px/Chevron-Up.svg";
import { ReactComponent as Close16 } from "assets/icons/16px/Close.svg";
import { ReactComponent as Delta16 } from "assets/icons/16px/Delta.svg";
import { ReactComponent as Dot16 } from "assets/icons/16px/Dot.svg";
import { ReactComponent as Enlarge } from "assets/icons/16px/Enlarge.svg";
import { ReactComponent as Home16 } from "assets/icons/16px/Home.svg";
import { ReactComponent as Information16 } from "assets/icons/16px/Information.svg";
import { ReactComponent as MoreHorizontal16 } from "assets/icons/16px/More-Horizontal.svg";
import { ReactComponent as MoreVertical16 } from "assets/icons/16px/More-Vertical.svg";
import { ReactComponent as NewMaterial16 } from "assets/icons/16px/New-Material.svg";
import { ReactComponent as Note16 } from "assets/icons/16px/Note.svg";
import { ReactComponent as Placeholder16 } from "assets/icons/16px/Placeholder.svg";
import { ReactComponent as Plus16 } from "assets/icons/16px/Plus.svg";
import { ReactComponent as CheckmarkOvalFilled } from "assets/icons/24px/Checkmark-Oval-Filled.svg";
import { ReactComponent as CheckmarkOvalOutline } from "assets/icons/24px/Checkmark-Oval-Outline.svg";
import { ReactComponent as ChevronDown24 } from "assets/icons/24px/Chevron-Down.svg";
import { ReactComponent as ChevronLeft24 } from "assets/icons/24px/Chevron-Left.svg";
import { ReactComponent as ChevronRight24 } from "assets/icons/24px/Chevron-Right.svg";
import { ReactComponent as ChevronUp24 } from "assets/icons/24px/Chevron-Up.svg";
import { ReactComponent as Close24 } from "assets/icons/24px/Close.svg";
import { ReactComponent as DefaultAvatar24 } from "assets/icons/24px/Default-Avatar.svg";
import { ReactComponent as Home24 } from "assets/icons/24px/Home.svg";
import { ReactComponent as Information24 } from "assets/icons/24px/Information.svg";
import { ReactComponent as Lightbulb } from "assets/icons/16px/Lightbulb.svg";
import { ReactComponent as List } from "assets/icons/24px/List.svg";
import { ReactComponent as MoreHorizontal24 } from "assets/icons/24px/More-Horizontal.svg";
import { ReactComponent as MoreVertical24 } from "assets/icons/24px/More-Vertical.svg";
import { ReactComponent as Placeholder24 } from "assets/icons/24px/Placeholder.svg";
import { ReactComponent as Plus24 } from "assets/icons/24px/Plus.svg";
import { ReactComponent as Search } from "assets/icons/24px/Search.svg";
import { ReactComponent as Settings } from "assets/icons/24px/Settings.svg";
import { ReactComponent as Trashcan } from "assets/icons/16px/Trashcan.svg";
import { ReactComponent as Warning } from "assets/icons/24px/Warning.svg";
import { ReactComponent as Document } from "assets/icons/16px/Document.svg";
import { ReactComponent as MediaPlay } from "assets/icons/16px/MediaPlay.svg";
import { ReactComponent as DragAndDrop } from "assets/icons/16px/DragAndDrop.svg";
import { ReactComponent as Share } from "assets/icons/16px/Share.svg";
import { Icons } from "atoms/constants/icons";
import { FunctionComponent, SVGProps } from "react";

export interface SvgIcon {
    key: keyof typeof Icons;
    base: FunctionComponent<SVGProps<SVGSVGElement>>;
    large: FunctionComponent<SVGProps<SVGSVGElement>>;
}

export const SvgIcons: SvgIcon[] = [
    { key: Icons.Checkmark, base: Checkmark, large: Checkmark },
    {
        key: Icons.CheckmarkOvalFilled,
        base: CheckmarkOvalFilled,
        large: CheckmarkOvalFilled,
    },
    {
        key: Icons.CheckmarkOvalOutline,
        base: CheckmarkOvalOutline,
        large: CheckmarkOvalOutline,
    },
    { key: Icons.ChevronDown, base: ChevronDown16, large: ChevronDown24 },
    { key: Icons.ChevronLeft, base: ChevronLeft16, large: ChevronLeft24 },
    { key: Icons.ChevronRight, base: ChevronRight16, large: ChevronRight24 },
    { key: Icons.ChevronUp, base: ChevronUp16, large: ChevronUp24 },
    { key: Icons.Close, base: Close16, large: Close24 },
    { key: Icons.DefaultAvatar, base: DefaultAvatar24, large: DefaultAvatar24 },
    { key: Icons.Delta, base: Delta16, large: Delta16 },
    { key: Icons.Dot, base: Dot16, large: Dot16 },
    { key: Icons.Enlarge, base: Enlarge, large: Enlarge },
    { key: Icons.Home, base: Home16, large: Home24 },
    { key: Icons.Information, base: Information16, large: Information24 },
    { key: Icons.Lightbulb, base: Lightbulb, large: Lightbulb },
    { key: Icons.List, base: List, large: List },
    {
        key: Icons.MoreHorizontal,
        base: MoreHorizontal16,
        large: MoreHorizontal24,
    },
    { key: Icons.MoreVertical, base: MoreVertical16, large: MoreVertical24 },
    { key: Icons.NewMaterial, base: NewMaterial16, large: NewMaterial16 },
    { key: Icons.Note, base: Note16, large: Note16 },
    { key: Icons.Placeholder, base: Placeholder16, large: Placeholder24 },
    { key: Icons.Plus, base: Plus16, large: Plus24 },
    { key: Icons.Search, base: Search, large: Search },
    { key: Icons.Settings, base: Settings, large: Settings },
    { key: Icons.Share, base: Share, large: Share },
    { key: Icons.Trashcan, base: Trashcan, large: Trashcan },
    { key: Icons.Warning, base: Warning, large: Warning },
    { key: Icons.Document, base: Document, large: Document },
    { key: Icons.MediaPlay, base: MediaPlay, large: MediaPlay },
    { key: Icons.DragAndDrop, base: DragAndDrop, large: DragAndDrop },
];
