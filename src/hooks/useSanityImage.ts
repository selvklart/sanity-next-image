import imageUrlBuilder from '@sanity/image-url';
import {useMemo} from 'react';
import {SanityImage} from '../image';
import {SanityProjectDetails} from 'src/components/SanityProjectDetailsProvider';

/**
 * Hook resolving the URL and width/height of the image passed in.
 *
 * It obeys the crop rectangle set on the image in Sanity, but it's also
 * possible to set a desired aspect-ratio to futher crop the image.
 */
export default function useSanityImage(projectDetails: SanityProjectDetails, image: SanityImage, aspectRatio?: number) {
	const imageDimensions = useMemo(() => {
		// First find the natural width and height from the asset ID. This
		// seems a bit hacky, but it's the same thing next-sanity-image
		// does, so it's likely to be the correct way of doing it. If we
		// couldn't parse the size form the ID we would have to do another
		// request to fetch the asset document, which would be annoying.
		const dimensions = image.asset._ref.split('-')[2];
		let [width, height] = dimensions.split('x').map((num) => parseInt(num, 10));

		// If the image has been cropped, adjust the width and height to
		// the cropped size:
		const crop = image.crop;
		if (crop) {
			width = Math.round(width * (1 - (crop.left + crop.right)));
			height = Math.round(height * (1 - (crop.top + crop.bottom)));
		}

		// If the user asked for a different aspect ratio, shrink either
		// the height or width depending on whether the image should be
		// wider or more narrow than it naturally is:
		if (aspectRatio) {
			const naturalAspectRatio = width / height;

			if (aspectRatio > naturalAspectRatio) {
				height = Math.round(width / aspectRatio);
			} else {
				width = Math.round(height * aspectRatio);
			}
		}

		return {
			width: width,
			height: height
		};
	}, [image, aspectRatio]);

	const src = useMemo(() => {
		return imageUrlBuilder(projectDetails)
			.image(image)
			.width(imageDimensions.width)
			.height(imageDimensions.height)
			.url();
	}, [projectDetails, image, imageDimensions]);

	return {
		src,
		width: imageDimensions.width,
		height: imageDimensions.height
	};
}
