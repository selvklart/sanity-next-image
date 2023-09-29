import Image, {ImageProps} from 'next/image';
import {useMemo, useRef} from 'react';
import useDebounce from '../hooks/useDebounce';
import useDimensions from '../hooks/useDimensions';
import useSanityImage from '../hooks/useSanityImage';
import {SanityImage} from '../sanity';
import {useSanityProjectDetails} from './SanityProjectDetailsProvider';

export interface NextImageFillProps extends Omit<ImageProps, 'src' | 'fill' | 'objectFit' | 'objectPosition'> {
	image: SanityImage,
	aspectRatio?: number
}

/**
 * Renders an image as an absolutely positioned element filling the containing
 * block completely.
 *
 * Normally this would be used to fill a parent element that has position set
 * to relative.
 *
 * The image is cropped according to the crop rectangle set in Sanity and can
 * be further cropped by setting an aspect ratio. The image hotspot will be
 * taken into consideration (if set) when cropping to fit the image to an
 * aspect ratio.
 *
 * The component will also try to position the image inside the containing
 * block so that the images hotspot is placed as near to the center of the
 * visible area as possible.
 */
export default function NextImageFill({image, aspectRatio, style = {}, ...rest}: NextImageFillProps) {
	const projectDetails = useSanityProjectDetails();
	const {
		src,
		width,
		height
	} = useSanityImage(projectDetails, image, aspectRatio);

	const ref = useRef<HTMLImageElement>(null);
	const dimensions = useDimensions(ref);
	const debouncedDimensions = useDebounce(dimensions, 1000);

	// NOTE: This code tries to get the browser to move the image within the
	//       filled rectangle by manipulating the object position.
	//
	//       Ideally this should move the hotspot as close to the center of
	//       the visible rectangle but it ends up being a little off.
	//
	//       The behaviour also seem to differ between browsers, so we will
	//       have to re-visit this. It's still better than just cropping to
	//       the center though, so we can keep it until we have a better
	//       solution.
	const objectPosition = useMemo(() => {
		let objectPosition = {
			x: 0.5,
			y: 0.5
		};

		if (image.hotspot) {
			if (image.crop) {
				objectPosition = {
					x: (image.hotspot.x - image.crop.left) / (1 - image.crop.left - image.crop.right),
					y: (image.hotspot.y - image.crop.top) / (1 - image.crop.top - image.crop.bottom)
				};
			} else {
				objectPosition.x = image.hotspot.x;
				objectPosition.y = image.hotspot.y;
			}
		}

		return objectPosition;
	}, [image]);

	const imageAspect = width / height;

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
	const currentDimensions = debouncedDimensions ?? dimensions;
	let sizes = 0;

	if (currentDimensions) {
		sizes = currentDimensions.width;

		// If the image is wider than the frame it is cropped into, adjust the
		// sizes prop so that it represents the real width of the image,
		// including the parts hidden outside the frame.
		//
		// This ensures we load a variant of the image with enough pixels to
		// show the visible part in full detail.
		const measuredAspect = currentDimensions.width / currentDimensions.height;
		if (imageAspect > measuredAspect) {
			sizes = imageAspect * currentDimensions.height;
		}
	}

	return (
		/* eslint-disable jsx-a11y/alt-text */
		<Image
			ref={ref}

			src={src}
			sizes={`${sizes}px`}

			fill
			style={{
				objectFit: 'cover',
				objectPosition: `left ${objectPosition.x * 100}% top ${objectPosition.y * 100}%`,
				...style
			}}

			{...rest}
		/>
	);
}
