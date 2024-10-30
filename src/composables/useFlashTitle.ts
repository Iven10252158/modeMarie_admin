export const useFlashTitle = (defaultTitle:string, newTitle: string) => {
  if (document.title === defaultTitle) {
    document.title = newTitle
  } else {
    document.title = defaultTitle
  }
}
