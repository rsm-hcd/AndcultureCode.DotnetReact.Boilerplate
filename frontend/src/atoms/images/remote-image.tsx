import Image, { ImageProps } from "atoms/images/image";
import Loader from "atoms/loaders/loader";
import React from "react";
import useRemoteFile from "utilities/hooks/use-remote-file";

// -------------------------------------------------------------------------------------------------
// #region Interfaces
// -------------------------------------------------------------------------------------------------

export interface RemoteImageProps extends Omit<ImageProps, "src"> {
    relativeProviderPath: string;
}

// #endregion Interfaces

// -------------------------------------------------------------------------------------------------
// #region Component
// -------------------------------------------------------------------------------------------------

const RemoteImage: React.FC<RemoteImageProps> = (props: RemoteImageProps) => {
    const { absoluteUrl, loading } = useRemoteFile(props.relativeProviderPath);

    if (loading) {
        return <Loader accessibleText="Loading image..." />;
    }

    return <Image src={absoluteUrl} {...props} />;
};

// #endregion Component

// -------------------------------------------------------------------------------------------------
// #region Export
// -------------------------------------------------------------------------------------------------

export default RemoteImage;

// #endregion Export
