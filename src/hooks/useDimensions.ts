import {RefObject, useLayoutEffect, useState} from 'react';

export interface Dimensions {
	width: number
	height: number
}

/**
 * Hook measuring a HTMLElement passed in as a ref, returning its width and
 * height.
 *
 * The measurement happens using a client side ResizeObserver and is updated
 * live as the dimensions of the element change.
 */
export default function useDimensions<T extends HTMLElement>(ref: RefObject<T>) {
	const [dimensions, setDimensions] = useState<Dimensions | null>(null);

	useLayoutEffect(() => {
		if (ref.current) {
			const element = ref.current;

			setDimensions({
				width: element.offsetWidth,
				height: element.offsetHeight
			});

			const observer = new ResizeObserver((entries) => {
				const rect = entries[0].contentRect;
				setDimensions({
					width: rect.width,
					height: rect.height
				});
			});

			observer.observe(element);

			return () => {
				observer.unobserve(element);
			};
		}
	}, [
		ref
	]);

	return dimensions;
}
