const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
            .catch((err) => {
                console.error(`Error in asyncHandler: ${err.message}`);
                next(err);
            });
    };
}

export { asyncHandler };