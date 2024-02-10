// what is this? Checkout src/ui/atoms/logo

// This types basically allow us to specify
// which tiles, in svg's viewbox should be colored,
// thus making us able to create good-looking,
// optimized, animated pixel arts.

export type position = {
    x: number;
    y: number
};

export type wrapper = {
    wrapperName: string;
    squares: position[];
};

export type SvgData = wrapper[];
