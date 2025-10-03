export const errorHandler = (error, req, res, next) => {
    console.error('🚨 Error:', {
        message: error.message,
        url: req.url,
        method: req.method
    })

    // Ошибки валидации из доменного слоя
    if (error.message.includes('is required') || error.message.includes('cannot be')) {
        return res.status(400).json({
            errors: [{
                title: 'Validation Error',
                detail: error.message,
                status: '400'
            }]
        })
    }

    // Ошибки "не найдено"
    if (error.message.includes('not found')) {
        return res.status(404).json({
            errors: [{
                title: 'Not Found',
                detail: error.message,
                status: '404'
            }]
        })
    }

    // Общие серверные ошибки
    res.status(500).json({
        errors: [{
            title: 'Internal Server Error',
            detail: 'Something went wrong',
            status: '500'
        }]
    })
}
