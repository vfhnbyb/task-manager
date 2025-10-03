export interface ModalConfig {
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    type?: 'default' | 'info'
}

export interface ConfirmModalType {
    open: (config: ModalConfig) => Promise<boolean>
    close: () => void
}
