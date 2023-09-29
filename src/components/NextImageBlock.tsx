import Image, {ImageProps} from 'next/image';
import {useRef} from 'react';
import useDebounce from '../hooks/useDebounce';
import useDimensions from '../hooks/useDimensions';
import useSanityImage from '../hooks/useSanityImage';
import {SanityImage} from '../sanity';
import {useSanityProjectDetails} from './SanityProjectDetailsProvider';

export interface NextImageBlockProps extends Omit<ImageProps, 'src' | 'width' | 'height' | 'sizes'> {
	image: SanityImage,
	aspectRatio?: number
}

/**
 * Renders an image as a block level element with 100% width and auto height.
 *
 * The image is cropped according to the crop rectangle set in Sanity and can
 * be further cropped by setting an aspect ratio. The image hotspot will be
 * taken into consideration (if set) when cropping to fit the image to an
 * aspect ratio.
 */
export default function NextImageBlock({image, aspectRatio, style = {}, ...rest}: NextImageBlockProps) {
	const projectDetails = useSanityProjectDetails();
	const {
		src,
		width,
		height
	} = useSanityImage(projectDetails, image, aspectRatio);

	const ref = useRef<HTMLImageElement>(null);
	const dimensions = useDimensions(ref);
	const debouncedDimensions = useDebounce(dimensions, 1000);

	// For the first render the measured dimensions will be null as the image
	// element hasn't been mounted yet. This means we won't have a reasonable
	// size to set in the size attribute, causing next.Image to render a blurry
	// 64px version of the image.
	//
	// To get out of that state as quickly as possible, we don't want to
	// debounce the change from null dimensions to actual dimensions. We do
	// that by using the raw measured dimensions until the debounced dimensions
	// change into _something_.
	//
	// If we didn't do this, we would (and did) show a blurry image for a
	// second while we wait for the debounce timer.
	const sizes = debouncedDimensions?.width ?? dimensions?.width;

	return (
		/* eslint-disable jsx-a11y/alt-text */
		<Image
			ref={ref}

			src={src}
			width={width}
			height={height}
			sizes={`${sizes ?? 0}px`}

			style={{
				display: 'block',
				width: '100%',
				height: 'auto',
				aspectRatio: width / height,
				...(style ?? {})
			}}

			{...rest}
		/>
	);
}

