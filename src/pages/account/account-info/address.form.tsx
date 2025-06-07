import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters.'
  })
})

const AddressForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: ''
    }
  })

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log('🚀 ~ onSubmit ~ data:', data)
  }

  return (
    <Card className="shadow-sm border-0 bg-white">
      <CardContent className="p-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin địa chỉ</h3>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 h-12 font-medium transition-colors"
            >
              Lưu
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default AddressForm
