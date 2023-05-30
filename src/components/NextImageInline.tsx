import Image, {ImageProps} from 'next/image';
import {useRef} from 'react';
import useDebounce from '../hooks/useDebounce';
import useDimensions from '../hooks/useDimensions';
import useSanityImage from '../hooks/useSanityImage';
import {SanityImage} from '../image';
import {useSanityProjectDetails} from './SanityProjectDetailsProvider';

export interface NextImageInlineProps extends Omit<ImageProps, 'src' | 'width' | 'height' | 'sizes'> {
	image: SanityImage,
	aspectRatio?: number
}

/**
 * Renders an image as an inline element.
 *
 * The image is cropped according to the crop rectangle set in Sanity and can
 * be further cropped by setting an aspect ratio. The image hotspot will be
 * taken into consideration (if set) when cropping to fit the image to an
 * aspect ratio.
 *
 * You must set the width and height of the image using css, but use auto
 * for one of the dimensions to allow the image to scale to the correct aspect
 * ratio. If you don't set a size the image will load in a random size or not
 * at all
 */
export default function NextImageInline({image, aspectRatio, style = {}, ...rest}: NextImageInlineProps) {
	const projectDetails = useSanityProjectDetails();
	const {
		src,
		width,
		height
	} = useSanityImage(projectDetails, image, aspectRatio);

	const ref = useRef<HTMLImageElement>(null);
	const dimensions = useDimensions(ref);
	const targetDimensions = useDebounce(dimensions, 1000);

	return (
		/* eslint-disable jsx-a11y/alt-text */
		<Image
			ref={ref}

			src={src}
			width={width}
			height={height}
			sizes={`${targetDimensions.width}px`}
			style={{
				aspectRatio: width / height,
				...style
			}}

			{...rest}
		/>
	);
}
